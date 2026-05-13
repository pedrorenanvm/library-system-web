import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import styles from "./MultasDoLeitor.module.css";

function MultasDoLeitor() {
    // 1. Hook de Autenticação
    const { usuario } = useAuth(); 

    // 2. Estado com 12 objetos para testar a rolagem
    const [multas, setMultas] = useState([
        { id: 1, idUsuario: 1, idEmprestimo: 10, quantidade: 10.00, status: 'pending', origem: "Atraso: Java Como Programar" },
        { id: 2, idUsuario: 1, idEmprestimo: 11, quantidade: 32.50, status: 'pending', origem: "Atraso: Redes de Computadores" },
        { id: 3, idUsuario: 1, idEmprestimo: 12, quantidade: 5.00,  status: 'pending', origem: "Atraso: Estruturas de Dados" },
        { id: 4, idUsuario: 1, idEmprestimo: 13, quantidade: 15.75, status: 'pending', origem: "Atraso: Engenharia de Software" },
        { id: 5, idUsuario: 1, idEmprestimo: 14, quantidade: 2.50,  status: 'pending', origem: "Atraso: Cálculo Diferencial" },
        { id: 6, idUsuario: 1, idEmprestimo: 15, quantidade: 20.00, status: 'pending', origem: "Atraso: Sistemas Operacionais" },
        { id: 7, idUsuario: 1, idEmprestimo: 16, quantidade: 12.00, status: 'pending', origem: "Atraso: Inteligência Artificial" },
        { id: 8, idUsuario: 1, idEmprestimo: 17, quantidade: 8.50,  status: 'pending', origem: "Atraso: Banco de Dados I" },
        { id: 9, idUsuario: 1, idEmprestimo: 18, quantidade: 45.00, status: 'pending', origem: "Atraso: Compiladores" },
        { id: 10, idUsuario: 1, idEmprestimo: 19, quantidade: 7.00,  status: 'pending', origem: "Atraso: Organização de Computadores" },
        { id: 11, idUsuario: 1, idEmprestimo: 20, quantidade: 11.20, status: 'pending', origem: "Atraso: Teoria da Computação" },
        { id: 12, idUsuario: 1, idEmprestimo: 21, quantidade: 3.50,  status: 'pending', origem: "Atraso: Ética na Computação" }
    ]);

    // 3. Variável de Filtro (Sincronizada com o ID do seu login)
    // Se quiser ver tudo sem filtrar para testar o layout, use: const multasDoUsuario = multas;
    const multasDoUsuario = multas.filter(m => m.idUsuario === usuario?.id || m.idUsuario === 101);

    // 4. Lógica de 7 linhas fixas
    const totalLinhasDesejadas = 7;
    const linhasVaziasCount = totalLinhasDesejadas - multasDoUsuario.length;
    const espacosExtras = linhasVaziasCount > 0 ? Array(linhasVaziasCount).fill(null) : [];

    const handleConfirmarPagamento = (id) => {
        setMultas(multas.filter(m => m.id !== id));
        window.alert("Pagamento registrado com sucesso!");
    };

    return (
        <div className={styles.container}>
            <Sidebar />

            <main className={styles.direita}>
                <Header 
                    titulo="Pagamento de multa" 
                    nome={usuario?.nome || "Leitor"} 
                    linkImg="https://img.icons8.com/ios-filled/100/ffffff/user.png" 
                />

                <section className={styles.secao}>
                    <h1 className={styles.tituloSection}>Minhas Multas Pendentes</h1>

                    <div className={styles.tabelaContainer}>
                        <table className={styles.tabela}>
                            <thead>
                                <tr>
                                    <th>Descrição / Obra</th>
                                    <th>Valor (R$)</th>
                                    <th>Status</th>
                                    <th>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {multasDoUsuario.map((m) => (
                                    <tr key={m.id}>
                                        <td>{m.origem}</td>
                                        <td className={styles.comMulta}>R$ {m.quantidade.toFixed(2)}</td>
                                        <td>{m.status === 'pending' ? 'Pendente' : 'Pago'}</td>
                                        <td>
                                            <button 
                                                className={styles.btnPagar} 
                                                onClick={() => handleConfirmarPagamento(m.id)}
                                            >
                                                Pagar com Cartão/PIX
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {espacosExtras.map((_, index) => (
                                    <tr key={`vazia-${index}`} className={styles.linhaVazia}>
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