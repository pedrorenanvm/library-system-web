import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../layouts/Sidebar';
import Header from '../layouts/Header';
import styles from './VerItens.module.css';
import api from '../services/api';

function VerItens() {
    const [itens, setItens] = useState([]);
    const [busca, setBusca] = useState('');
    const [tipoFiltro, setTipoFiltro] = useState('');
    const [statusFiltro, setStatusFiltro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');

    useEffect(() => {
        buscarItens();
    }, []);

    async function buscarItens() {
        try {
            setCarregando(true);
            setErro('');

            const response = await api.get('/v1/api/titles?page=1&limit=100');

            const dados = response.data?.data || response.data || [];

            setItens(dados);
        } catch (error) {
            console.log(error);
            setErro('Erro ao carregar os itens do acervo.');
        } finally {
            setCarregando(false);
        }
    }

    function traduzirTipo(tipo) {
        if (tipo === 'book') return 'Livro';
        if (tipo === 'periodical') return 'Periódico';
        if (tipo === 'other') return 'Outro';
        return 'Não informado';
    }

    function getTitulo(item) {
        return item.name || item.title || 'Sem título';
    }

    function getExemplares(item) {
        return item.totalCopies ?? item.total_copies ?? 0;
    }

    function getDisponiveis(item) {
        return item.availableCopies ?? item.available_copies ?? getExemplares(item);
    }

    function getDescricao(item) {
        return item.description || '';
    }

    function getAutor(item) {
        const descricao = getDescricao(item);
        const resultado = descricao.match(/Autor\(es\):\s*(.*?)(?=\s+Ano:|\n|$)/i);
        return resultado ? resultado[1].trim() : 'Não informado';
    }

    function getAno(item) {
        const descricao = getDescricao(item);
        const resultado = descricao.match(/Ano:\s*(.*?)(?=\s+Categoria:|\s+Gênero:|\n|$)/i);
        return resultado ? resultado[1].trim() : 'Não informado';
    }

    function getGenero(item) {
        const descricao = getDescricao(item);
        const resultado = descricao.match(/(?:Categoria|Gênero):\s*(.*?)(?=\n|$)/i);
        return resultado ? resultado[1].trim() : 'Não informado';
    }

    const itensFiltrados = useMemo(() => {
        return itens.filter((item) => {
            const buscaTexto = busca.toLowerCase();

            const titulo = getTitulo(item).toLowerCase();
            const autor = getAutor(item).toLowerCase();
            const ano = getAno(item).toLowerCase();
            const genero = getGenero(item).toLowerCase();
            const tipo = item.type || '';
            const tipoTraduzido = traduzirTipo(tipo).toLowerCase();
            const disponiveis = getDisponiveis(item);

            const bateBusca =
                titulo.includes(buscaTexto) ||
                autor.includes(buscaTexto) ||
                ano.includes(buscaTexto) ||
                genero.includes(buscaTexto) ||
                tipoTraduzido.includes(buscaTexto);

            const bateTipo =
                tipoFiltro === '' || tipo === tipoFiltro;

            const bateStatus =
                statusFiltro === '' ||
                (statusFiltro === 'disponivel' && disponiveis > 0) ||
                (statusFiltro === 'indisponivel' && disponiveis === 0);

            return bateBusca && bateTipo && bateStatus;
        });
    }, [itens, busca, tipoFiltro, statusFiltro]);

    function limparFiltros() {
        setBusca('');
        setTipoFiltro('');
        setStatusFiltro('');
    }

    return (
        <div className={styles.container}>
            <Sidebar />

            <main className={styles.direita}>
                <Header
                    titulo="Acervo"
                    nome="Bibliotecário"
                    linkImg="https://img.icons8.com/ios-filled/100/ffffff/user.png"
                />

                <section className={styles.secao}>
                    <div className={styles.topo}>
                        <h1 className={styles.tituloSection}>Itens do acervo</h1>

                    </div>

                    <div className={styles.filtros}>
                        <div className={styles.campoBusca}>
                            <label>Buscar</label>
                            <input
                                type="text"
                                placeholder="Buscar por título, autor, ano, gênero ou tipo"
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                            />
                        </div>

                        <div className={styles.campoFiltro}>
                            <label>Tipo</label>
                            <select
                                value={tipoFiltro}
                                onChange={(e) => setTipoFiltro(e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="book">Livro</option>
                                <option value="periodical">Periódico</option>
                                <option value="other">Outro</option>
                            </select>
                        </div>

                        <div className={styles.campoFiltro}>
                            <label>Status</label>
                            <select
                                value={statusFiltro}
                                onChange={(e) => setStatusFiltro(e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="disponivel">Disponível</option>
                                <option value="indisponivel">Indisponível</option>
                            </select>
                        </div>

                        <button className={styles.btnLimpar} onClick={limparFiltros}>
                            Limpar
                        </button>
                    </div>

                    {carregando && (
                        <p className={styles.mensagem}>Carregando itens...</p>
                    )}

                    {erro && (
                        <p className={styles.erro}>{erro}</p>
                    )}

                    {!carregando && !erro && (
                        <div className={styles.tabela}>
                            <div className={styles.cabecalho}>
                                <span>Título</span>
                                <span>Autor</span>
                                <span>Ano</span>
                                <span>Gênero</span>
                                <span>Tipo</span>
                                <span>Exemplares</span>
                                <span>Status</span>
                            </div>

                            {itensFiltrados.length === 0 ? (
                                <p className={styles.mensagem}>Nenhum item encontrado.</p>
                            ) : (
                                itensFiltrados.map((item) => {
                                    const titulo = getTitulo(item);
                                    const autor = getAutor(item);
                                    const ano = getAno(item);
                                    const genero = getGenero(item);
                                    const tipo = traduzirTipo(item.type);
                                    const exemplares = getExemplares(item);
                                    const disponiveis = getDisponiveis(item);

                                    return (
                                        <div className={styles.linha} key={item.id}>
                                            <span className={styles.tituloItem}>{titulo}</span>
                                            <span>{autor}</span>
                                            <span>{ano}</span>
                                            <span>{genero}</span>
                                            <span>{tipo}</span>
                                            <span>{disponiveis}/{exemplares}</span>

                                            <span
                                                className={
                                                    disponiveis > 0
                                                        ? styles.disponivel
                                                        : styles.indisponivel
                                                }
                                            >
                                                {disponiveis > 0 ? 'Disponível' : 'Indisponível'}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default VerItens;