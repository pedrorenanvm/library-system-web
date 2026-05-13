import styles from './Sidebar.module.css'
import { NavLink } from 'react-router-dom'
import logo from '../assets/BibliotecaLogoBranco.png'

function Sidebar(){
    return(
        <aside className={styles.principal}>
            <img src={logo} alt="BibliotecaLogoBranco"  style={{ width: 250, marginBottom: 30 }}/>
            <nav className={styles.nav}>
                <ul className={styles.ul}>
                    <li className={styles.li}>Dashboard</li>

                    <NavLink to="/bibliotecario/adicionar">
                        <li className={styles.li}>Acervo</li>
                    </NavLink>

                    <NavLink to="/bibliotecario/adicionarLeitor">
                        <li className={styles.li}>Leitores</li>
                    </NavLink>

                    <NavLink to="/bibliotecario/adicionarDevolucao">
                        <li className={styles.li}>Empréstimos</li>
                    </NavLink>

                    <NavLink to="/bibliotecario/pagarMulta">{/*------------------Teste(será removido dps)-----------------*/}
                        <li className={styles.li}>Multa do leitor(teste)</li>
                    </NavLink>
                    

                    <li className={styles.li}>Relatórios</li>

                    <li className={styles.li}>Sair</li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;