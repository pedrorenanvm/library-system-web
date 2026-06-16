import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import styles from "./VerLeitores.module.css";
import { useState, useEffect } from "react";
import api from "../services/api";

function VerLeitores() {
    const [leitores, setLeitores] = useState([]);
    const [busca, setBusca] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');
    const [feedback, setFeedback] = useState('');
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);

    const carregarLeitores = async (nome = '', page = 1) => {
        setCarregando(true);
        setErro('');
        try {
            const res = await api.get('/v1/api/readers', {
                params: { page, limit: 10, name: nome || undefined }
            });
            setLeitores(res.data.data);
            setTotalPaginas(res.data.last_page);
        } catch {
            setErro('Erro ao carregar leitores.');
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregarLeitores();
    }, []);

    const handleBusca = (e) => {
        e.preventDefault();
        setPagina(1);
        carregarLeitores(busca, 1);
    };

    const handlePagina = (nova) => {
        setPagina(nova);
        carregarLeitores(busca, nova);
    };

    const tornarProfessor = async (leitor) => {
        if (!confirm(`Transformar ${leitor.name} em professor?`)) return;
        try {
            await api.put(`/v1/api/readers/${leitor.id}`, {
                name: leitor.name,
                email: leitor.email,
                registrationNumber: leitor.registrationNumber,
                phone: leitor.phone || null,
                role: 'teacher',
            });
            setFeedback('sucesso');
            carregarLeitores(busca, pagina);
        } catch {
            setFeedback('erro');
        } finally {
            setTimeout(() => setFeedback(''), 3000);
        }
    };

    const deletarLeitor = async (leitor) => {
        if (!confirm(`Deseja deletar ${leitor.name}?`)) return;
        try {
            await api.delete(`/v1/api/readers/${leitor.id}`);
            setFeedback('sucesso');
            carregarLeitores(busca, pagina);
        } catch {
            setFeedback('erro');
        } finally {
            setTimeout(() => setFeedback(''), 3000);
        }
    };

    const roleLabel = {
        reader: 'Leitor',
        teacher: 'Professor',
        admin: 'Admin',
    };

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.direita}>
                <Header
                    titulo="Leitores"
                    nome="Bibliotecário"
                    linkImg="https://img.icons8.com/ios-filled/100/ffffff/user.png"
                />
                <section className={styles.secao}>
                    <h1 className={styles.tituloSection}>Usuários cadastrados</h1>

                    {feedback === 'sucesso' && (
                        <p style={{ color: 'green', background: '#e6ffe6', padding: 8, borderRadius: 4, marginBottom: 12 }}>
                            Operação realizada com sucesso!
                        </p>
                    )}
                    {feedback === 'erro' && (
                        <p style={{ color: 'red', background: '#ffe6e6', padding: 8, borderRadius: 4, marginBottom: 12 }}>
                            Erro ao realizar operação.
                        </p>
                    )}

                    <form onSubmit={handleBusca} className={styles.barraBusca}>
                        <input
                            type="text"
                            placeholder="Buscar por nome..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                        />
                        <button type="submit" className={styles.btnAdicionar}>Buscar</button>
                    </form>

                    {erro && <p style={{ color: 'red', fontSize: 13 }}>{erro}</p>}
                    {carregando && <p style={{ color: '#888' }}>Carregando...</p>}

                    {!carregando && leitores.length === 0 && (
                        <p style={{ color: '#888', marginTop: 16 }}>Nenhum usuário encontrado.</p>
                    )}

                    <div className={styles.lista}>
                        {leitores.map(l => (
                            <div key={l.id} className={styles.card}>
                                <div className={styles.cardInfo}>
                                    <strong>{l.name}</strong>
                                    <span>{l.email}</span>
                                    <span>Matrícula: {l.registrationNumber}</span>
                                    {l.phone && <span>Telefone: {l.phone}</span>}
                                    <span style={{ fontSize: 11, color: '#888' }}>
                                        {roleLabel[l.role] || l.role}
                                    </span>
                                </div>
                                <div className={styles.cardAcoes}>
                                    <span className={l.isActive ? styles.ativo : styles.inativo}>
                                        {l.isActive ? 'Ativo' : 'Inativo'}
                                    </span>
                                    {l.role === 'reader' && (
                                        <button
                                            className={styles.btnProfessor}
                                            onClick={() => tornarProfessor(l)}
                                        >
                                            Tornar Professor
                                        </button>
                                    )}
                                    {l.role !== 'admin' && (
                                        <button
                                            className={styles.btnDeletar}
                                            onClick={() => deletarLeitor(l)}
                                        >
                                            Deletar
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPaginas > 1 && (
                        <div className={styles.paginacao}>
                            <button
                                onClick={() => handlePagina(pagina - 1)}
                                disabled={pagina === 1}
                                className={styles.btnCancelar}
                            >
                                Anterior
                            </button>
                            <span>{pagina} / {totalPaginas}</span>
                            <button
                                onClick={() => handlePagina(pagina + 1)}
                                disabled={pagina === totalPaginas}
                                className={styles.btnAdicionar}
                            >
                                Próxima
                            </button>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default VerLeitores;