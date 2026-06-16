import { useState } from 'react';
import styles from './Sidebar.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/BibliotecaLogoBranco.png';
import { useAuth } from '../hooks/useAuth';

function Sidebar() {
    const [showEmprestimos, setShowEmprestimos] = useState(false);
    const [showAcervo, setShowAcervo] = useState(false);
    const [showLeitores, setShowLeitores] = useState(false);
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className={styles.principal}>
            <img
                src={logo}
                alt="BibliotecaLogoBranco"
                className={styles.logo}
            />

            {usuario && (
                <div style={{ textAlign: 'center', marginBottom: 16, color: '#fff', fontSize: 13 }}>
                    <div style={{ fontWeight: 'bold' }}>{usuario.nome}</div>
                    <div style={{ opacity: 0.7, fontSize: 11 }}>{usuario.role}</div>
                </div>
            )}

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
                                    <NavLink to="/bibliotecario/adicionar" className={styles.submenuLink}>
                                        Adicionar item
                                    </NavLink>
                                </li>
                                <li className={`${styles.submenuItem} ${styles.divider}`}>
                                    <NavLink to="/bibliotecario/acervo" className={styles.submenuLink}>
                                        Ver itens
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li className={styles.li}>
                        <div
                            onClick={() => setShowLeitores(!showLeitores)}
                            className={styles.menuTitulo}
                        >
                            Leitores {showLeitores ? '▴' : '▾'}
                        </div>

                        {showLeitores && (
                            <ul className={styles.submenu}>
                                <li className={styles.submenuItem}>
                                    <NavLink to="/bibliotecario/adicionarLeitor" className={styles.submenuLink}>
                                        Cadastrar Leitor
                                    </NavLink>
                                </li>
                                <li className={`${styles.submenuItem} ${styles.divider}`}>
                                    <NavLink to="/bibliotecario/verLeitores" className={styles.submenuLink}>
                                        Ver Leitores
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </li>

                    <NavLink to="/bibliotecario/assinaturas">
                        <li className={styles.li}>Assinaturas</li>
                    </NavLink>

                    <NavLink to="/bibliotecario/registrarPerda">
                        <li className={styles.li}>Registrar Perda</li>
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
                                    <NavLink to="/bibliotecario/novoEmprestimo" className={styles.submenuLink}>
                                        Novo Empréstimo
                                    </NavLink>
                                </li>
                                <li className={`${styles.submenuItem} ${styles.divider}`}>
                                    <NavLink to="/bibliotecario/adicionarDevolucao" className={styles.submenuLink}>
                                        Devoluções
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </li>

                    <NavLink to="/bibliotecario/pagarMulta">
                        <li className={styles.li}>Multas</li>
                    </NavLink>


                    <li
                        className={`${styles.li} ${styles.sair}`}
                        onClick={handleLogout}
                        style={{ cursor: 'pointer' }}
                    >
                        Sair
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;