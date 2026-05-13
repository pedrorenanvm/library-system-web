import { useState } from 'react';
import styles from './Sidebar.module.css';
import { NavLink } from 'react-router-dom';
import logo from '../assets/BibliotecaLogoBranco.png';

function Sidebar() {
    const [showEmprestimos, setShowEmprestimos] = useState(false);

    return (
        <aside className={styles.principal}>
            {/* Logo da Biblioteca */}
            <img 
                src={logo} 
                alt="BibliotecaLogoBranco" 
                style={{ width: 250, marginBottom: 30 }} 
            />

            <nav className={styles.nav}>
                <ul className={styles.ul}>
                    {/* Item Simples */}
                    <li className={styles.li}>Dashboard</li>

                    {/* Link Direto */}
                    <NavLink to="/bibliotecario/adicionar" className={({ isActive }) => isActive ? styles.active : ""}>
                        <li className={styles.li}>Acervo</li>
                    </NavLink>

                    <NavLink to="/bibliotecario/adicionarLeitor">
                        <li className={styles.li}>Leitores</li>
                    </NavLink>

                    {/* Item com Submenu (Empréstimos) */}
                    <li className={styles.li}>
                        <div 
                            onClick={() => setShowEmprestimos(!showEmprestimos)} 
                            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', width: '100%' }}
                        >
                            Empréstimos {showEmprestimos ? '▴' : '▾'}
                        </div>
                        
                        {showEmprestimos && (
                            <ul className={styles.submenu}>
                                <li className={styles.submenuItem}>
                                    <NavLink 
                                        to="/bibliotecario/novoEmprestimo" 
                                        className={styles.submenuLink}
                                    >
                                        Novo Empréstimo
                                    </NavLink>
                                </li>
                                <li className={`${styles.submenuItem} ${styles.divider}`}>
                                    <NavLink 
                                        to="/bibliotecario/adicionarDevolucao" 
                                        className={styles.submenuLink}
                                    >
                                        Devoluções
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* Itens Adicionais */}
                    <NavLink to="/bibliotecario/pagarMulta">
                        <li className={styles.li}>Multa do leitor (teste)</li>
                    </NavLink>

                    <li className={styles.li}>Relatórios</li>

                    <li className={styles.li} style={{ marginTop: 'auto', color: '#ff4d4d' }}>Sair</li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;