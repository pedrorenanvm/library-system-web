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
                className={styles.logo}
            />

            <nav className={styles.nav}>
                <ul className={styles.ul}>
                    <NavLink to="/bibliotecario/dashboard">
                        <li className={styles.li}>Dashboard</li>
                    </NavLink>

                    <li className={styles.li}>
                        <div
                            onClick={() => setShowAcervo(!showAcervo)}
                            className={styles.menuTitulo}
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
                            className={styles.menuTitulo}
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
                        <li className={styles.li}>Multas</li>
                    </NavLink>

                    <li className={styles.li}>Relatórios</li>

                    <li className={`${styles.li} ${styles.sair}`}>
                        Sair
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;