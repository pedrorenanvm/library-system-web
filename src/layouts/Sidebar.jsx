import styles from './Sidebar.module.css'
function Sidebar(){
    return(
        <aside className={styles.principal}>
            <h1 className={styles.tituloPrincipal}>Biblioteca</h1>
            <nav className={styles.nav}>
                <ul className={styles.ul}>
                    <li className={styles.li}>DashBoard</li>
                    <li className={styles.li}>Acervo</li>
                    <li className={styles.li}>Leitores</li>
                    <li className={styles.li}>Empréstimos</li>
                    <li className={styles.li}>Relatórios</li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;