import { useState } from "react";
import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import styles from "./Devolucao.module.css";

function Devolucao() {
    // Dados simulados usando composição de objetos
    const [emprestimos, setEmprestimos] = useState([
        { 
            id: 1, 
            obra: { id: 50, nome: "Java Como Programar", tipo: "book" }, 
            leitor: { id: 101, nome: "Alisson Santos", tipoUsuario: "reader" },
            dataLimite: "2026-05-10", 
            multaPaga: false 
        },
        { 
            id: 2, 
            obra: { id: 60, nome: "Estruturas de Dados", tipo: "book" }, 
            leitor: { id: 102, nome: "João Silva", tipoUsuario: "reader" },
            dataLimite: "2026-05-20", 
            multaPaga: false 
        },
        { 
            id: 3, 
            obra: { id: 70, nome: "Redes de Computadores", tipo: "book" }, 
            leitor: { id: 103, nome: "José Maria", tipoUsuario: "reader" },
            dataLimite: "2026-05-01", 
            multaPaga: false 
        },
        { 
            id: 4, 
            obra: { id: 80, nome: "Harry Potter e a Pedra Filosofal", tipo: "book" }, 
            leitor: { id: 104, nome: "Maria José", tipoUsuario: "reader" },
            dataLimite: "2026-10-10", 
            multaPaga: false 
        },
        { 
            id: 5, 
            obra: { id: 90, nome: "Tróia", tipo: "book" }, 
            leitor: { id: 105, nome: "Suzana Vieira", tipoUsuario: "reader" },
            dataLimite: "2026-03-01", 
            multaPaga: false 
        },
        { 
            id: 6, 
            obra: { id: 100, nome: "A Origem das Espécies", tipo: "book" }, 
            leitor: { id: 106, nome: "Mauro Antonio", tipoUsuario: "reader" },
            dataLimite: "2026-05-13", 
            multaPaga: false 
        },
        { 
            id: 7, 
            obra: { id: 110, nome: "Programação de Jogos", tipo: "book" }, 
            leitor: { id: 107, nome: "José Carvalho", tipoUsuario: "reader" },
            dataLimite: "2026-05-14", 
            multaPaga: false 
        },
        { 
            id: 8, 
            obra: { id: 120, nome: "Cálculo Diferencial e Integral", tipo: "book" }, 
            leitor: { id: 108, nome: "Fernanda Lima", tipoUsuario: "reader" },
            dataLimite: "2026-05-05", 
            multaPaga: false 
        },
        { 
            id: 9, 
            obra: { id: 130, nome: "Engenharia de Software", tipo: "book" }, 
            leitor: { id: 109, nome: "Roberto Carlos", tipoUsuario: "reader" },
            dataLimite: "2026-06-01", 
            multaPaga: false 
        }
    ]);

    const calcularMulta = (dataLimite) => {
        const hoje = new Date();
        const limite = new Date(dataLimite);
        const diffTempo = hoje - limite;
        const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24));
        return diffDias > 0 ? diffDias * 2.50 : 0;
    };

    const handlePagamento = (id) => {
        setEmprestimos(emprestimos.map(emp =>
            emp.id === id ? { ...emp, multaPaga: true } : emp
        ));
    };

    const handleDevolucao = (id) => {
        setEmprestimos(emprestimos.filter(emp => emp.id !== id));
    };

    // Lógica das 7 linhas fixas
    const totalLinhasDesejadas = 7;
    const linhasVaziasCount = totalLinhasDesejadas - emprestimos.length;
    const espacosExtras = linhasVaziasCount > 0 ? Array(linhasVaziasCount).fill(null) : [];

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.direita}>
                <Header 
                    titulo="Devolução e pagamento de multa" 
                    nome="Bibliotecario" 
                    linkImg="https://img.icons8.com/ios-filled/100/ffffff/user.png" 
                />

                <section className={styles.secao}>
                    <h1 className={styles.tituloSection}>Empréstimos em aberto</h1>

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
                                    const valorCalculado = calcularMulta(emp.dataLimite);
                                    const multaExibida = emp.multaPaga ? 0 : valorCalculado;

                                    return (
                                        <tr key={emp.id}>
                                            <td>{emp.leitor.nome}</td>
                                            <td>{emp.obra.nome}</td>
                                            <td>{new Date(emp.dataLimite).toLocaleDateString('pt-BR')}</td>
                                            <td className={multaExibida > 0 ? styles.comMulta : ""}>
                                                {multaExibida > 0 ? `R$ ${multaExibida.toFixed(2)}` : "Isento"}
                                            </td>
                                            <td>
                                                {multaExibida > 0 ? (
                                                    <button className={styles.btnPagar} onClick={() => handlePagamento(emp.id)}>
                                                        Pagar
                                                    </button>
                                                ) : (
                                                    <button className={styles.btnDevolver} onClick={() => handleDevolucao(emp.id)}>
                                                        Confirmar Devolução
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}

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