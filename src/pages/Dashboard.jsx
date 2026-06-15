import { useEffect, useMemo, useState } from "react";
import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import styles from "./Dashboard.module.css";
import api from "../services/api";

function Dashboard() {
    const [titulos, setTitulos] = useState([]);
    const [leitores, setLeitores] = useState([]);
    const [emprestimos, setEmprestimos] = useState([]);

    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        carregarDashboard();
    }, []);

    async function carregarDashboard() {
        try {
            setCarregando(true);
            setErro("");

            const [responseTitulos, responseLeitores] = await Promise.all([
                api.get("/v1/api/titles", {
                    params: {
                        page: 1,
                        limit: 100
                    }
                }),
                api.get("/v1/api/readers", {
                    params: {
                        page: 1,
                        limit: 100
                    }
                })
            ]);

            const listaTitulos = responseTitulos.data?.data || responseTitulos.data || [];
            const listaLeitores = responseLeitores.data?.data || responseLeitores.data || [];

            setTitulos(listaTitulos);
            setLeitores(listaLeitores);

            const respostasEmprestimos = await Promise.all(
                listaLeitores.map(async (leitor) => {
                    const response = await api.get("/v1/api/loans", {
                        params: {
                            userId: leitor.id
                        }
                    });

                    const dados = response.data?.data || response.data || [];

                    return dados.map((emp) => ({
                        ...emp,
                        leitor
                    }));
                })
            );

            setEmprestimos(respostasEmprestimos.flat());
        } catch (error) {
            console.log(error);

            const mensagem =
                error.response?.data?.details?.join("\n") ||
                error.response?.data?.message ||
                "Erro ao carregar dashboard.";

            setErro(mensagem);
        } finally {
            setCarregando(false);
        }
    }

    function getNomeTitulo(emp) {
        return (
            emp.copy?.title?.name ||
            emp.title?.name ||
            emp.titleName ||
            "obra não informada"
        );
    }

    function formatarData(data) {
        if (!data) return "";

        return new Date(data).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    const totalItens = titulos.length;

    const usuariosAtivos = leitores.filter((leitor) => {
        return leitor.isActive !== false && leitor.is_active !== false;
    }).length;

    const emprestimosAtivos = emprestimos.filter((emp) => {
        return emp.status === "active" || emp.status === "overdue";
    }).length;

    const devolucoesFeitas = emprestimos.filter((emp) => {
        return emp.status === "returned";
    }).length;

    const atividadesRecentes = useMemo(() => {
        const atividadesTitulos = titulos.map((titulo) => ({
            texto: `Novo item adicionado ao acervo: ${titulo.name}`,
            data: titulo.createdAt || titulo.created_at
        }));

        const atividadesEmprestimos = emprestimos.map((emp) => {
            if (emp.status === "returned") {
                return {
                    texto: `Devolução registrada: ${getNomeTitulo(emp)} por ${emp.leitor?.name || "leitor"}`,
                    data: emp.returnedAt || emp.returned_at || emp.updatedAt || emp.updated_at
                };
            }

            return {
                texto: `Empréstimo ativo: ${getNomeTitulo(emp)} para ${emp.leitor?.name || "leitor"}`,
                data: emp.loanedAt || emp.loaned_at || emp.createdAt || emp.created_at
            };
        });

        return [...atividadesTitulos, ...atividadesEmprestimos]
            .filter((atividade) => atividade.data)
            .sort((a, b) => new Date(b.data) - new Date(a.data))
            .slice(0, 8);
    }, [titulos, emprestimos]);

    return (
        <div className={styles.container}>
            <Sidebar />

            <main className={styles.direita}>
                <Header
                    titulo="Dashboard"
                    nome="Bibliotecário"
                    linkImg="https://img.icons8.com/ios-filled/100/ffffff/user.png"
                />

                <section className={styles.secao}>
                    <div className={styles.topo}>
                        <div>
                            <h1 className={styles.tituloSection}>Dashboard</h1>
                            <p className={styles.subtitulo}>Resumo geral da biblioteca</p>
                        </div>

                        <button
                            type="button"
                            className={styles.btnAtualizar}
                            onClick={carregarDashboard}
                            disabled={carregando}
                        >
                            {carregando ? "Atualizando..." : "Atualizar"}
                        </button>
                    </div>

                    {erro && <p className={styles.erro}>{erro}</p>}

                    <div className={styles.cards}>
                        <div className={styles.card}>
                            <span>Total de itens</span>
                            <strong>{totalItens}</strong>
                            <p>Itens cadastrados no acervo</p>
                        </div>

                        <div className={styles.card}>
                            <span>Usuários ativos</span>
                            <strong>{usuariosAtivos}</strong>
                            <p>Leitores cadastrados</p>
                        </div>

                        <div className={styles.card}>
                            <span>Empréstimos ativos</span>
                            <strong>{emprestimosAtivos}</strong>
                            <p>Empréstimos em aberto</p>
                        </div>

                        <div className={styles.card}>
                            <span>Devoluções feitas</span>
                            <strong>{devolucoesFeitas}</strong>
                            <p>Empréstimos já devolvidos</p>
                        </div>
                    </div>

                    <div className={styles.atividade}>
                        <h2>Atividade recente</h2>

                        {carregando && (
                            <p className={styles.mensagem}>Carregando dados...</p>
                        )}

                        {!carregando && atividadesRecentes.length === 0 && (
                            <p className={styles.mensagem}>Nenhuma atividade recente encontrada.</p>
                        )}

                        {!carregando && atividadesRecentes.length > 0 && (
                            <ul>
                                {atividadesRecentes.map((atividade, index) => (
                                    <li key={index}>
                                        <strong>{atividade.texto}</strong>
                                        <span>{formatarData(atividade.data)}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Dashboard;