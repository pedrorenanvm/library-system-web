import Sidebar from '../layouts/Sidebar';
import Header from '../layouts/Header';
import styles from './AdicionarItem.module.css';
import { useState } from 'react';
import api from '../services/api';

function AdicionarItem() {
    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState('');
    const [tipo, setTipo] = useState('book');
    const [ano, setAno] = useState('');
    const [exemplares, setExemplares] = useState('');
    const [categoria, setCategoria] = useState('');
    const [carregando, setCarregando] = useState(false);

    async function adicionarItem(e) {
        e.preventDefault();

        try {
            setCarregando(true);

            const item = {
                name: titulo,
                description: `
Autor(es): ${autor}
Ano: ${ano}
Categoria: ${categoria}
                `.trim(),
                type: tipo,
                maxLoanDays: 7,
                totalCopies: Number(exemplares)
            };

            await api.post('/v1/api/titles', item);

            alert('Item adicionado com sucesso!');

            setTitulo('');
            setAutor('');
            setTipo('book');
            setAno('');
            setExemplares('');
            setCategoria('');
        } catch (error) {
            console.log(error);

            const mensagem =
                error.response?.data?.details?.join('\n') ||
                error.response?.data?.message ||
                'Erro ao adicionar item';

            alert(mensagem);
        } finally {
            setCarregando(false);
        }
    }

    function cancelar() {
        setTitulo('');
        setAutor('');
        setTipo('book');
        setAno('');
        setExemplares('');
        setCategoria('');
    }

    return (
        <div className={styles.container}>
            <Sidebar />

            <main className={styles.direita}>
                <Header
                    titulo="Adicionar novo item ao acervo"
                    nome="Bibliotecário"
                    linkImg="https://img.icons8.com/ios-filled/100/ffffff/user.png"
                />

                <section className={styles.secao}>
                    <h1 className={styles.tituloSection}>Adicionar item</h1>

                    <form className={styles.gridFormulario} onSubmit={adicionarItem}>
                        <div className={styles.campoMetade}>
                            <label>Título</label>
                            <input
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.campoMetade}>
                            <label>Autor/Autores</label>
                            <input
                                type="text"
                                value={autor}
                                onChange={(e) => setAutor(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.campoPequeno}>
                            <label>Tipo</label>
                            <select
                                className={styles.seletor}
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                required
                            >
                                <option value="book">Livro</option>
                                <option value="periodical">Periódico</option>
                                <option value="other">Outro</option>
                            </select>
                        </div>

                        <div className={styles.campoPequeno}>
                            <label>Ano</label>
                            <input
                                type="number"
                                value={ano}
                                onChange={(e) => setAno(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.campoPequeno}>
                            <label>Exemplares</label>
                            <input
                                type="number"
                                min="1"
                                value={exemplares}
                                onChange={(e) => setExemplares(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.campoPequeno}>
                            <label>Categoria</label>
                            <input
                                type="text"
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles.containerBotoes}>
                            <button
                                type="button"
                                className={styles.btnCancelar}
                                onClick={cancelar}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className={styles.btnAdicionar}
                                disabled={carregando}
                            >
                                {carregando ? 'Salvando...' : 'Adicionar item'}
                            </button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    );
}

export default AdicionarItem;