import styles from './Sidebar.module.css'
import { NavLink } from 'react-router-dom'
import logo from '../assets/BibliotecaLogoBranco.png'

function Sidebar(){
    return(
        <aside className={styles.principal}>
            <img src={logo} alt="BibliotecaLogoBranco"  style={{ width: 250, marginBottom: 24 }}/>
            <nav className={styles.nav}>
                <ul className={styles.ul}>
                    <li className={styles.li}>DashBoard</li>
                    <li className={styles.li}>
                        <NavLink to="/bibliotecario/adicionar">Acervo</NavLink></li>
                    <li className={styles.li}>
                        <NavLink to="/bibliotecario/adicionarLeitor">Leitores</NavLink></li>
                    <li className={styles.li}>Empréstimos</li>
                    <li className={styles.li}>Relatórios</li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;