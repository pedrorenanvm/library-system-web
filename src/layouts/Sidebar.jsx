import { useState } from 'react';
import styles from './Sidebar.module.css';
import { NavLink } from 'react-router-dom';
import logo from '../assets/BibliotecaLogoBranco.png';

function Sidebar() {
    const [showEmprestimos, setShowEmprestimos] = useState(false);

    return (
        <aside className={styles.principal}>
            <img src={logo} alt="BibliotecaLogoBranco" style={{ width: 250, marginBottom: 70 }} />
            <nav className={styles.nav}>
                <ul className={styles.ul}>
                    <li className={styles.li}>Dashboard</li>
                    
                    <li className={styles.li}>
                        <NavLink to="/bibliotecario/adicionar">Acervo</NavLink>
                    </li>
                    
                    <li className={styles.li}>
                        <NavLink to="/bibliotecario/adicionarLeitor">Leitores</NavLink>
                    </li>

                    <li className={styles.li}>
                        <div 
                            onClick={() => setShowEmprestimos(!showEmprestimos)} 
                            style={{ cursor: 'pointer', display: 'block', width: '100%' }}
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

                    <li className={styles.li}>Relatórios</li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;