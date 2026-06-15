import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import styles from "./Devolucao.module.css";
import { useEffect, useState } from "react";
import api from "../services/api";

function Devolucao() {
    const [leitores, setLeitores] = useState([]);
    const [emprestimos, setEmprestimos] = useState([]);

    const [leitorSelecionado, setLeitorSelecionado] = useState("");

    const [carregandoLeitores, setCarregandoLeitores] = useState(false);
    const [carregandoEmprestimos, setCarregandoEmprestimos] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    useEffect(() => {
        buscarLeitores();
    }, []);

    async function buscarLeitores() {
        try {
            setCarregandoLeitores(true);
            setErro("");

            const response = await api.get("/v1/api/readers", {
                params: {
                    page: 1,
                    limit: 100
                }
            });

            const dados = response.data?.data || response.data || [];
            setLeitores(dados);
        } catch (error) {
            console.log(error);
            setErro("Erro ao carregar leitores.");
        } finally {
            setCarregandoLeitores(false);
        }
    }

    async function buscarEmprestimos(userId) {
        if (!userId) return;

        try {
            setCarregandoEmprestimos(true);
            setErro("");
            setSucesso("");

            const response = await api.get("/v1/api/loans", {
                params: {
                    userId
                }
            });

            const dados = response.data?.data || response.data || [];

            const emAberto = dados.filter((emp) =>
                emp.status === "active" || emp.status === "overdue"
            );

            setEmprestimos(emAberto);
        } catch (error) {
            console.log(error);

            const mensagem =
                error.response?.data?.details?.join("\n") ||
                error.response?.data?.message ||
                "Erro ao carregar empréstimos.";

            setErro(mensagem);
            setEmprestimos([]);
        } finally {
            setCarregandoEmprestimos(false);
        }
    }

    async function selecionarLeitor(e) {
        const userId = e.target.value;

        setLeitorSelecionado(userId);
        setEmprestimos([]);
        setErro("");
        setSucesso("");

        if (userId) {
            await buscarEmprestimos(userId);
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

            await buscarEmprestimos(leitorSelecionado);
        } catch (error) {
            console.log(error);

            const mensagem =
                error.response?.data?.details?.join("\n") ||
                error.response?.data?.message ||
                "Erro ao confirmar devolução.";

            setErro(mensagem);
        }
    }

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
            leitores.find((leitor) => leitor.id === leitorSelecionado)?.name ||
            "Leitor selecionado"
        );
    }

    function getDataLimite(emp) {
        return emp.dueDate || emp.due_date;
    }

    function formatarData(data) {
        if (!data) return "-";

        return new Date(data).toLocaleDateString("pt-BR");
    }

    function calcularMulta(dataLimite) {
        if (!dataLimite) return 0;

        const hoje = new Date();
        const limite = new Date(dataLimite);

        hoje.setHours(0, 0, 0, 0);
        limite.setHours(0, 0, 0, 0);

        const diffTempo = hoje - limite;
        const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24));

        return diffDias > 0 ? diffDias * 2.5 : 0;
    }

    function limpar() {
        setLeitorSelecionado("");
        setEmprestimos([]);
        setErro("");
        setSucesso("");
    }

    const totalLinhasDesejadas = 7;
    const linhasVaziasCount = totalLinhasDesejadas - emprestimos.length;
    const espacosExtras = linhasVaziasCount > 0 ? Array(linhasVaziasCount).fill(null) : [];

    return (
        <div className={styles.container}>
            <Sidebar />

            <main className={styles.direita}>
                <Header
                    titulo="Devolução e pagamento de multa"
                    nome="Bibliotecário"
                    linkImg="https://img.icons8.com/ios-filled/100/ffffff/user.png"
                />

                <section className={styles.secao}>
                    <h1 className={styles.tituloSection}>Empréstimos em aberto</h1>

                    {erro && <p style={{ color: "red", marginBottom: 10 }}>{erro}</p>}
                    {sucesso && <p style={{ color: "green", marginBottom: 10 }}>{sucesso}</p>}

                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, marginBottom: 20 }}>
                        <div>
                            <label>Leitor</label>

                            <select
                                value={leitorSelecionado}
                                onChange={selecionarLeitor}
                                style={{
                                    width: "100%",
                                    padding: 10,
                                    border: "none",
                                    backgroundColor: "#dfdfdf",
                                    borderRadius: 8
                                }}
                            >
                                <option value="">
                                    {carregandoLeitores ? "Carregando leitores..." : "Selecione um leitor"}
                                </option>

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
                            style={{ alignSelf: "end" }}
                        >
                            Limpar
                        </button>
                    </div>

                    {carregandoEmprestimos && (
                        <p style={{ marginBottom: 10 }}>Carregando empréstimos...</p>
                    )}

                    <div className={styles.tabelaContainer}>
                        <table className={styles.tabela}>
                            <thead>
                                <tr>
                                    <th>Leitor</th>
                                    <th>Obra</th>
                                    <th>Data Limite</th>
                                    <th>Multa (R$)</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                                {emprestimos.map((emp) => {
                                    const dataLimite = getDataLimite(emp);
                                    const valorMulta = calcularMulta(dataLimite);

                                    return (
                                        <tr key={emp.id}>
                                            <td>{getLeitor(emp)}</td>
                                            <td>{getTitulo(emp)}</td>
                                            <td>{formatarData(dataLimite)}</td>

                                            <td className={valorMulta > 0 ? styles.comMulta : ""}>
                                                {valorMulta > 0 ? `R$ ${valorMulta.toFixed(2)}` : "Isento"}
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

                                {!carregandoEmprestimos && leitorSelecionado && emprestimos.length === 0 && (
                                    <tr>
                                        <td colSpan="5">Nenhum empréstimo em aberto para este leitor.</td>
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