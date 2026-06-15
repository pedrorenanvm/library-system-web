import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import styles from "./Devolucao.module.css";
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

function Devolucao() {
    const [leitores, setLeitores] = useState([]);
    const [todosEmprestimos, setTodosEmprestimos] = useState([]);
    const [leitorSelecionado, setLeitorSelecionado] = useState("");

    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        try {
            setCarregando(true);
            setErro("");
            setSucesso("");

            const responseLeitores = await api.get("/v1/api/readers", {
                params: {
                    page: 1,
                    limit: 100
                }
            });

            const listaLeitores = responseLeitores.data?.data || responseLeitores.data || [];
            setLeitores(listaLeitores);

            const respostasEmprestimos = await Promise.all(
                listaLeitores.map(async (leitor) => {
                    const response = await api.get("/v1/api/loans", {
                        params: {
                            userId: leitor.id
                        }
                    });

                    const emprestimos = response.data?.data || response.data || [];

                    return emprestimos.map((emp) => ({
                        ...emp,
                        leitor
                    }));
                })
            );

            const listaCompleta = respostasEmprestimos.flat();

            const emAberto = listaCompleta.filter((emp) =>
                emp.status === "active" || emp.status === "overdue"
            );

            setTodosEmprestimos(emAberto);
        } catch (error) {
            console.log(error);

            const mensagem =
                error.response?.data?.details?.join("\n") ||
                error.response?.data?.message ||
                "Erro ao carregar devoluções pendentes.";

            setErro(mensagem);
            setTodosEmprestimos([]);
        } finally {
            setCarregando(false);
        }
    }

    async function confirmarDevolucao(id) {
        const confirmar = window.confirm("Confirmar devolução deste empréstimo?");

        if (!confirmar) return;

        try {
            setErro("");
            setSucesso("");

            await api.put(`/v1/api/loans/${id}/devolucao`);

            setSucesso("Devolução registrada com sucesso!");

            await carregarDados();
        } catch (error) {
            console.log(error);

            const mensagem =
                error.response?.data?.details?.join("\n") ||
                error.response?.data?.message ||
                "Erro ao confirmar devolução.";

            setErro(mensagem);
        }
    }

    const emprestimosFiltrados = useMemo(() => {
        if (!leitorSelecionado) {
            return todosEmprestimos;
        }

        return todosEmprestimos.filter((emp) => {
            const userId = emp.userId || emp.user_id || emp.user?.id || emp.leitor?.id;

            return userId === leitorSelecionado;
        });
    }, [todosEmprestimos, leitorSelecionado]);

    function getTitulo(emp) {
        return (
            emp.copy?.title?.name ||
            emp.title?.name ||
            emp.titleName ||
            "Não informado"
        );
    }

    function getLeitor(emp) {
        return (
            emp.user?.name ||
            emp.reader?.name ||
            emp.leitor?.name ||
            "Não informado"
        );
    }

    function getDataLimite(emp) {
        return emp.dueDate || emp.due_date;
    }

    function formatarData(data) {
        if (!data) return "-";

        return new Date(data).toLocaleDateString("pt-BR");
    }

    function estaAtrasado(dataLimite) {
        if (!dataLimite) return false;

        const hoje = new Date();
        const limite = new Date(dataLimite);

        hoje.setHours(0, 0, 0, 0);
        limite.setHours(0, 0, 0, 0);

        return limite < hoje;
    }

    function limpar() {
        setLeitorSelecionado("");
        setErro("");
        setSucesso("");
    }

    const totalLinhasDesejadas = 7;
    const linhasVaziasCount = totalLinhasDesejadas - emprestimosFiltrados.length;
    const espacosExtras = linhasVaziasCount > 0 ? Array(linhasVaziasCount).fill(null) : [];

    return (
        <div className={styles.container}>
            <Sidebar />

            <main className={styles.direita}>
                <Header
                    titulo="Devolução"
                    nome="Bibliotecário"
                    linkImg="https://img.icons8.com/ios-filled/100/ffffff/user.png"
                />

                <section className={styles.secao}>
                    <h1 className={styles.tituloSection}>Empréstimos em aberto</h1>

                    {erro && <p className={styles.erro}>{erro}</p>}
                    {sucesso && <p className={styles.sucesso}>{sucesso}</p>}

                    <div className={styles.filtros}>
                        <div>
                            <label>Leitor</label>

                            <select
                                value={leitorSelecionado}
                                onChange={(e) => setLeitorSelecionado(e.target.value)}
                                className={styles.selectLeitor}
                            >
                                <option value="">Todos os leitores</option>

                                {leitores.map((leitor) => (
                                    <option key={leitor.id} value={leitor.id}>
                                        {leitor.name} — {leitor.email}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            className={styles.btnDevolver}
                            onClick={limpar}
                        >
                            Limpar
                        </button>

                        <button
                            type="button"
                            className={styles.btnDevolver}
                            onClick={carregarDados}
                        >
                            Atualizar
                        </button>
                    </div>

                    {carregando && (
                        <p className={styles.mensagem}>Carregando devoluções pendentes...</p>
                    )}

                    <div className={styles.tabelaContainer}>
                        <table className={styles.tabela}>
                            <thead>
                                <tr>
                                    <th>Leitor</th>
                                    <th>Obra</th>
                                    <th>Data Limite</th>
                                    <th>Situação</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                                {emprestimosFiltrados.map((emp) => {
                                    const dataLimite = getDataLimite(emp);
                                    const atrasado = estaAtrasado(dataLimite);

                                    return (
                                        <tr key={emp.id}>
                                            <td>{getLeitor(emp)}</td>
                                            <td>{getTitulo(emp)}</td>
                                            <td>{formatarData(dataLimite)}</td>

                                            <td>
                                                <span className={atrasado ? styles.atrasado : styles.emDia}>
                                                    {atrasado ? "Atrasado" : "Em dia"}
                                                </span>
                                            </td>

                                            <td>
                                                <button
                                                    className={styles.btnDevolver}
                                                    onClick={() => confirmarDevolucao(emp.id)}
                                                >
                                                    Confirmar Devolução
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {!carregando && emprestimosFiltrados.length === 0 && (
                                    <tr>
                                        <td colSpan="5">Nenhuma devolução pendente encontrada.</td>
                                    </tr>
                                )}

                                {espacosExtras.map((_, index) => (
                                    <tr key={`vazia-${index}`} className={styles.linhaVazia}>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>-</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Devolucao;