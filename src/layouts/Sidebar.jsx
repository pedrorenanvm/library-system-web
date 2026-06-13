import { useState } from 'react';
import styles from './Sidebar.module.css';
import { NavLink } from 'react-router-dom';
import logo from '../assets/BibliotecaLogoBranco.png';

function Sidebar() {
    const [showEmprestimos, setShowEmprestimos] = useState(false);
    const [showAcervo, setShowAcervo] = useState(false);

    return (
        <aside className={styles.principal}>
            <img 
                src={logo} 
                alt="BibliotecaLogoBranco" 
                style={{ width: 250, marginBottom: 30 }} 
            />

            <nav className={styles.nav}>
                <ul className={styles.ul}>
                    <li className={styles.li}>Dashboard</li>

                    <li className={styles.li}>
                        <div 
                            onClick={() => setShowAcervo(!showAcervo)} 
                            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', width: '100%' }}
                        >
                            Acervo {showAcervo ? '▴' : '▾'}
                        </div>

                        {showAcervo && (
                            <ul className={styles.submenu}>
                                <li className={styles.submenuItem}>
                                    <NavLink 
                                        to="/bibliotecario/adicionar" 
                                        className={styles.submenuLink}
                                    >
                                        Adicionar item
                                    </NavLink>
                                </li>

                                <li className={`${styles.submenuItem} ${styles.divider}`}>
                                    <NavLink 
                                        to="/bibliotecario/acervo" 
                                        className={styles.submenuLink}
                                    >
                                        Ver itens
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </li>

                    <NavLink to="/bibliotecario/adicionarLeitor">
                        <li className={styles.li}>Leitores</li>
                    </NavLink>

                    <NavLink to="/bibliotecario/assinaturas">
                        <li className={styles.li}>Assinaturas</li>
                    </NavLink>

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

                    <NavLink to="/bibliotecario/pagarMulta">
                        <li className={styles.li}>Multa do leitor (teste)</li>
                    </NavLink>

                    <li className={styles.li}>Relatórios</li>

                    <li className={styles.li} style={{ marginTop: 'auto', color: '#ff4d4d' }}>
                        Sair
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;