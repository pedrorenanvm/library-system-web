import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import styles from "./Assinaturas.module.css";
import { useState, useEffect } from "react";
import api from "../services/api";

function Assinaturas() {
    const [assinaturas, setAssinaturas] = useState([]);
    const [titulos, setTitulos] = useState([]);
    const [filtroStatus, setFiltroStatus] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [erro, setErro] = useState('');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const [titleId, setTitleId] = useState('');
    const [publisher, setPublisher] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [cost, setCost] = useState('');
    const [renewalFrequency, setRenewalFrequency] = useState('');

    const carregarAssinaturas = async () => {
        try {
            const res = await api.get('/v1/api/subscriptions', {
                params: filtroStatus ? { status: filtroStatus } : {}
            });
            setAssinaturas(res.data);
        } catch {
            setErro('Erro ao carregar assinaturas.');
        }
    };

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const [resTitulos] = await Promise.all([
                    api.get('/v1/api/titles', { params: { page: 1, limit: 100 } }),
                ]);
                setTitulos(resTitulos.data.data);
            } catch {
                setErro('Erro ao carregar títulos.');
            }
        };
        carregarDados();
        carregarAssinaturas();
    }, []);

    useEffect(() => {
        carregarAssinaturas();
    }, [filtroStatus]);

    const criarAssinatura = async (e) => {
        e.preventDefault();
        setErro('');
        setCarregando(true);
        try {
            await api.post('/v1/api/subscriptions', {
                titleId,
                publisher: publisher || null,
                startDate,
                endDate,
                cost: cost ? Number(cost) : null,
                renewalFrequency: renewalFrequency || null,
            });
            setFeedback('sucesso');
            setMostrarFormulario(false);
            setTitleId(''); setPublisher(''); setStartDate('');
            setEndDate(''); setCost(''); setRenewalFrequency('');
            carregarAssinaturas();
        } catch {
            setFeedback('erro');
        } finally {
            setCarregando(false);
            setTimeout(() => setFeedback(null), 3000);
        }
    };

    const renovar = async (id, novaData) => {
        try {
            await api.put(`/v1/api/subscriptions/${id}`, {
                action: 'renew',
                newEndDate: novaData,
            });
            setFeedback('sucesso');
            carregarAssinaturas();
        } catch {
            setFeedback('erro');
        } finally {
            setTimeout(() => setFeedback(null), 3000);
        }
    };

    const cancelar = async (id) => {
        if (!confirm('Deseja cancelar esta assinatura?')) return;
        try {
            await api.put(`/v1/api/subscriptions/${id}`, { action: 'cancel' });
            setFeedback('sucesso');
            carregarAssinaturas();
        } catch {
            setFeedback('erro');
        } finally {
            setTimeout(() => setFeedback(null), 3000);
        }
    };

    const statusLabel = {
        active: { texto: 'Ativa', cor: 'green' },
        expiring_soon: { texto: 'Expirando', cor: 'orange' },
        expired: { texto: 'Expirada', cor: 'red' },
        cancelled: { texto: 'Cancelada', cor: 'gray' },
    };

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.direita}>
                <Header
                    titulo="Assinaturas de Periódicos"
                    nome="Bibliotecário"
                    linkImg="https://img.icons8.com/ios-filled/100/ffffff/user.png"
                />
                <section className={styles.secao}>
                    <div className={styles.topoSecao}>
                        <h1 className={styles.tituloSection}>Assinaturas</h1>
                        <button
                            className={styles.btnAdicionar}
                            onClick={() => setMostrarFormulario(!mostrarFormulario)}
                        >
                            {mostrarFormulario ? 'Fechar' : '+ Nova Assinatura'}
                        </button>
                    </div>

                    {feedback === 'sucesso' && (
                        <p style={{ color: 'green', background: 'whitesmoke', marginBottom: 12, padding: 8, borderRadius: 4 }}>
                            Operação realizada com sucesso!
                        </p>
                    )}
                    {feedback === 'erro' && (
                        <p style={{ color: 'red', background: 'whitesmoke', marginBottom: 12, padding: 8, borderRadius: 4 }}>
                            Erro ao realizar operação. Tente novamente.
                        </p>
                    )}
                    {erro && <p style={{ color: 'red', fontSize: 13, marginBottom: 8 }}>{erro}</p>}

                    {mostrarFormulario && (
                        <form className={styles.gridFormulario} onSubmit={criarAssinatura}>
                            <div className={styles.campoMetade}>
                                <label>Título (Periódico)</label>
                                <select
                                    value={titleId}
                                    onChange={(e) => setTitleId(e.target.value)}
                                    required
                                    style={{ padding: 10, borderRadius: 8, border: 'none', background: '#dfdfdf' }}
                                >
                                    <option value="">Selecione um título</option>
                                    {titulos.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.campoMetade}>
                                <label>Editora (opcional)</label>
                                <input
                                    type="text"
                                    value={publisher}
                                    onChange={(e) => setPublisher(e.target.value)}
                                />
                            </div>

                            <div className={styles.campoPequeno}>
                                <label>Data de Início</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.campoPequeno}>
                                <label>Data de Vencimento</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className={styles.campoPequeno}>
                                <label>Custo (opcional)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={cost}
                                    onChange={(e) => setCost(e.target.value)}
                                />
                            </div>

                            <div className={styles.campoPequeno}>
                                <label>Frequência de Renovação</label>
                                <input
                                    type="text"
                                    placeholder="Ex: mensal, anual"
                                    value={renewalFrequency}
                                    onChange={(e) => setRenewalFrequency(e.target.value)}
                                />
                            </div>

                            <div className={styles.containerBotoes}>
                                <button
                                    type="button"
                                    className={styles.btnCancelar}
                                    onClick={() => setMostrarFormulario(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className={styles.btnAdicionar}
                                    disabled={carregando}
                                >
                                    {carregando ? 'Salvando...' : 'Criar Assinatura'}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className={styles.filtros}>
                        <label>Filtrar por status:</label>
                        <select
                            value={filtroStatus}
                            onChange={(e) => setFiltroStatus(e.target.value)}
                            style={{ padding: 8, borderRadius: 8, border: 'none', background: '#dfdfdf' }}
                        >
                            <option value="">Todos</option>
                            <option value="active">Ativas</option>
                            <option value="expiring_soon">Expirando</option>
                            <option value="expired">Expiradas</option>
                            <option value="cancelled">Canceladas</option>
                        </select>
                    </div>

                    <div className={styles.lista}>
                        {assinaturas.length === 0 ? (
                            <p style={{ color: '#888', marginTop: 16 }}>Nenhuma assinatura encontrada.</p>
                        ) : (
                            assinaturas.map(a => (
                                <div key={a.id} className={styles.card}>
                                    <div className={styles.cardInfo}>
                                        <strong>{a.title?.name || 'Título não encontrado'}</strong>
                                        <span>{a.publisher || 'Sem editora'}</span>
                                        <span>Início: {new Date(a.startDate).toLocaleDateString('pt-BR')}</span>
                                        <span>Vencimento: {new Date(a.endDate).toLocaleDateString('pt-BR')}</span>
                                        {a.cost && <span>Custo: R$ {Number(a.cost).toFixed(2)}</span>}
                                        {a.renewalFrequency && <span>Frequência: {a.renewalFrequency}</span>}
                                    </div>
                                    <div className={styles.cardAcoes}>
                                        <span style={{
                                            color: statusLabel[a.status]?.cor || 'black',
                                            fontWeight: 'bold',
                                            fontSize: 13
                                        }}>
                                            {statusLabel[a.status]?.texto || a.status}
                                        </span>
                                        {a.status !== 'cancelled' && (
                                            <>
                                                <button
                                                    className={styles.btnRenovar}
                                                    onClick={() => {
                                                        const novaData = prompt('Nova data de vencimento (AAAA-MM-DD):');
                                                        if (novaData) renovar(a.id, novaData);
                                                    }}
                                                >
                                                    Renovar
                                                </button>
                                                <button
                                                    className={styles.btnCancelarCard}
                                                    onClick={() => cancelar(a.id)}
                                                >
                                                    Cancelar
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Assinaturas;