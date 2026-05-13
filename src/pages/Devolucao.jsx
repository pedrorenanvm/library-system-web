import { useState } from "react";
import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import styles from "./Devolucao.module.css"


function Devolucao(){

    

    // Exemplo de dados vindos do banco/API
    const [emprestimos, setEmprestimos] = useState([
    { id: 1, obra: "Java Como Programar", dataLimite: "2026-05-10", leitor: "Alisson Santos", multaPaga: false },
    { id: 2, obra: "Estruturas de Dados", dataLimite: "2026-05-20", leitor: "João Silva", multaPaga: false },
    { id: 3, obra: "Redes de Computadores", dataLimite: "2026-05-01", leitor: "Maria Souza", multaPaga: false },
    { id: 4, obra: "Redes de Computadores", dataLimite: "2026-05-01", leitor: "Maria Souza", multaPaga: false },
    { id: 5, obra: "Redes de Computadores", dataLimite: "2026-05-01", leitor: "Maria Souza", multaPaga: false },
    { id: 6, obra: "Redes de Computadores", dataLimite: "2026-05-01", leitor: "Maria Souza", multaPaga: false },
    { id: 7, obra: "Redes de Computadores", dataLimite: "2026-05-01", leitor: "Maria Souza", multaPaga: false }
]);

    const calcularMulta = (dataLimite) => {
        const hoje = new Date();
        const limite = new Date(dataLimite);
        const diffTempo = hoje - limite;
        const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24));

        if (diffDias > 0) {
            const valorMulta = diffDias * 2.50; // Exemplo: R$ 2,50 por dia de atraso
            return valorMulta;
        }

        
        return 0;
    };

    // Funções de lógica para os botões
const handlePagamento = (id) => {
    setEmprestimos(emprestimos.map(emp => 
        emp.id === id ? { ...emp, multaPaga: true } : emp
    ));
};

const handleDevolucao = (id) => {
    setEmprestimos(emprestimos.filter(emp => emp.id !== id));
};



    const dataAtual = new Date();
    console.log(dataAtual);

    const linhasVazias = 5 - emprestimos.length;
    const espacosExtras = linhasVazias > 0 ? Array(linhasVazias).fill(null) : [];

    return(
        <div className={styles.container}>
            <Sidebar/>

            <main className={styles.direita}>

                <Header titulo={`Devolução e exibição de multa`} nome={`Bibliotecário`} linkImg={`https://img.icons8.com/ios-filled/100/ffffff/user.png`}/>

                <section className={styles.secao}>
                    <h1 className={styles.tituloSection}>Empréstimos em aberto</h1>
                    
                    {/**Tabela */}
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
                               {/* 1. Renderiza as linhas com dados reais */}
    {emprestimos.map((emp) => {
        const valorCalculado = calcularMulta(emp.dataLimite);
        const multaExibida = emp.multaPaga ? 0 : valorCalculado;

        return (
            <tr key={emp.id}>
                <td>{emp.leitor}</td>
                <td>{emp.obra}</td>
                <td>{new Date(emp.dataLimite).toLocaleDateString('pt-BR')}</td>
                <td className={multaExibida > 0 ? styles.comMulta : ""}>
                    {multaExibida > 0 ? `R$ ${multaExibida.toFixed(2)}` : "Isento"}
                </td>
                <td>
                    {multaExibida > 0 ? (
                        <button className={styles.btnPagar} onClick={() => handlePagamento(emp.id)}>
                            Pagar e Devolver
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

    {/* 2. Renderiza as linhas vazias para manter a altura */}
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

                    {/**Fim */}
                
                </section>
            </main>
        
        </div>
    );

}

export default Devolucao