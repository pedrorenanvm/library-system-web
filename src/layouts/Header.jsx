import styles from './Header.module.css'

function Header({ titulo, nome, linkImg }) {
  return (
    <header className={styles.header}>
      <h1 className={styles.h1}>{titulo}</h1>
      <div className={styles.componentes}>
        <span className={styles.texto}>{nome}</span>
        <img className={styles.imagem} src={linkImg} />
      </div>
    </header>
  )
}

export default Header