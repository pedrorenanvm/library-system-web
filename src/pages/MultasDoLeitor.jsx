import { useEffect, useMemo, useState } from "react";
import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import styles from "./MultasDoLeitor.module.css";
import api from "../services/api";

function MultasDoLeitor() {
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

            setTodosEmprestimos(listaCompleta);
        } catch (error) {
            console.log("ERRO AO CARREGAR MULTAS");
            console.log("STATUS:", error.response?.status);
            console.log("DATA:", error.response?.data);
            console.log("ERRO COMPLETO:", error);

            const mensagem =
                error.response?.data?.details?.join("\n") ||
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Erro ao carregar multas.";

            setErro(mensagem);
            setTodosEmprestimos([]);
        } finally {
            setCarregando(false);
        }
    }

    async function confirmarPagamento(fineId) {
        const confirmar = window.confirm("Confirmar pagamento desta multa?");

        if (!confirmar) return;

        try {
            setErro("");
            setSucesso("");

            await api.post(`/v1/api/fines/${fineId}/pagamento`);

            setSucesso("Pagamento registrado com sucesso!");

            await carregarDados();
        } catch (error) {
            console.log("ERRO AO PAGAR MULTA");
            console.log("STATUS:", error.response?.status);
            console.log("DATA:", error.response?.data);
            console.log("ERRO COMPLETO:", error);

            const mensagem =
                error.response?.data?.details?.join("\n") ||
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Erro ao registrar pagamento.";

            setErro(mensagem);
        }
    }

    const multasPendentes = useMemo(() => {
        const multas = todosEmprestimos.filter((emp) => {
            return emp.fine && emp.fine.status === "pending";
        });

        if (!leitorSelecionado) {
            return multas;
        }

        return multas.filter((emp) => {
            const userId =
                emp.userId ||
                emp.user_id ||
                emp.user?.id ||
                emp.reader?.id ||
                emp.leitor?.id;

            return userId === leitorSelecionado;
        });
    }, [todosEmprestimos, leitorSelecionado]);

    function getTitulo(emp) {
        return (
            emp.copy?.title?.name ||
            emp.title?.name ||
            emp.titleName ||
            "Obra não informada"
        );
    }

    function getValorMulta(fine) {
        return Number(fine.amount || 0).toFixed(2);
    }

    function getDiasAtraso(fine) {
        return fine.overdueDays || fine.overdue_days || 0;
    }

    function traduzirStatus(status) {
        if (status === "pending") return "Pendente";
        if (status === "paid") return "Pago";
        if (status === "waived") return "Isento";

        return status || "Não informado";
    }

    function limpar() {
        setLeitorSelecionado("");
        setErro("");
        setSucesso("");
    }

    const totalLinhasDesejadas = 7;
    const linhasVaziasCount = totalLinhasDesejadas - multasPendentes.length;
    const espacosExtras = linhasVaziasCount > 0 ? Array(linhasVaziasCount).fill(null) : [];

    return (
        <div className={styles.container}>
            <Sidebar />

            <main className={styles.direita}>
                <Header
                    titulo="Pagamento de multa"
                    nome="Bibliotecário"
                    linkImg="https://img.icons8.com/ios-filled/100/ffffff/user.png"
                />

                <section className={styles.secao}>
                    <h1 className={styles.tituloSection}>Multas pendentes do leitor</h1>

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
                            className={styles.btnLimpar}
                            onClick={limpar}
                        >
                            Limpar
                        </button>
                    </div>

                    {carregando && (
                        <p className={styles.mensagem}>Carregando multas...</p>
                    )}

                    <div className={styles.tabelaContainer}>
                        <table className={styles.tabela}>
                            <thead>
                                <tr>
                                    <th>Descrição / Obra</th>
                                    <th>Valor (R$)</th>
                                    <th>Dias de atraso</th>
                                    <th>Status</th>
                                    <th>Ação</th>
                                </tr>
                            </thead>

                            <tbody>
                                {multasPendentes.map((emp) => (
                                    <tr key={emp.fine.id}>
                                        <td>Atraso: {getTitulo(emp)}</td>

                                        <td className={styles.comMulta}>
                                            R$ {getValorMulta(emp.fine)}
                                        </td>

                                        <td>{getDiasAtraso(emp.fine)}</td>

                                        <td>{traduzirStatus(emp.fine.status)}</td>

                                        <td>
                                            <button
                                                className={styles.btnPagar}
                                                onClick={() => confirmarPagamento(emp.fine.id)}
                                            >
                                                Confirmar pagamento
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {!carregando && multasPendentes.length === 0 && (
                                    <tr>
                                        <td colSpan="5">Nenhuma multa pendente encontrada.</td>
                                    </tr>
                                )}

                                {espacosExtras.map((_, index) => (
                                    <tr key={`vazia-${index}`} className={styles.linhaVazia}>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
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

export default MultasDoLeitor;