import Sidebar from '../layouts/Sidebar';
import Header from '../layouts/Header';
import styles from './AdicionarItem.module.css'
import {useState} from 'react';
function AdicionarItem(){

    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState('');
    const [tipo, setTipo] = useState('');
    const [ano, setAno] = useState('');
    const [exemplares, setExemplares] = useState('');
    const[codigo, setCodigo] = useState('');
    const [categoria, setCategoria] = useState('');
    const [descricao, setDescricao] = useState('');

    function adicionarItem(e){
        e.preventDefault();
        console.log(titulo);
        console.log(autor);
        console.log(tipo)
        console.log(ano);
        console.log(exemplares);
        console.log(categoria);
        console.log(descricao);
        window.alert('Item salvo com sucesso!')
    }

    return(
        <div className={styles.container}>
            <Sidebar/>

            <main className={styles.direita}>

                <Header titulo={`Adicionar novo item ao acervo`} nome={`Bibliotecário`} linkImg={`https://img.icons8.com/ios-filled/100/ffffff/user.png`}/>

                <section className={styles.secao}>
                    <h1 className={styles.tituloSection}>Adicionar item</h1>
                <form className={styles.gridFormulario} onSubmit={adicionarItem}>
                        {/* Linha 1 */}
                        <div className={styles.campoMetade}>
                            <label>Título</label>
                            <input required type="text" onChange={(e) => setTitulo(e.target.value)}/>
                        </div>
                        <div className={styles.campoMetade}>
                            <label>Autor/Autores</label>
                            <input required type="text" onChange={(e) => setAutor(e.target.value)} />
                        </div>

                        {/* Linha 2 */}
                        <div className={styles.campoPequeno}>
                            <label>Tipo</label>
                            <select
                                required
                                className={styles.seletor} 
                                value={tipo} 
                                onChange={(e) => setTipo(e.target.value)}
                            >
                                <option value="livro">Livro</option>
                                <option value="periodico">Periódico</option>
                                <option value="outro">Outro</option>
                            </select>
                        </div>

                        <div className={styles.campoPequeno}>
                            <label>Ano</label>
                            <input required type="number" onChange={(e) => setAno(e.target.value)}/>
                        </div>
                        <div className={styles.campoPequeno}>
                            <label>Exemplares</label>
                            <input required type="number" onChange={(e) => setExemplares(e.target.value)}/>
                        </div>
                        
                        <div className={styles.campoPequeno}>
                            <label>Categoria</label>
                            <input required type="text" onChange={(e) => setCategoria(e.target.value)}/>
                        </div>

                        {/* Linha 3 */}
                        <div className={styles.campoTotal}>
                            <label>Descrição</label>
                            <textarea required rows="4" onChange={(e) => setDescricao(e.target.value)}></textarea>
                        </div>

                        <div className={styles.containerBotoes}>
                            <button type="button" className={styles.btnCancelar}>Cancelar</button>
                            <button type="submit" className={styles.btnAdicionar}>Adicionar item</button>
                        </div>
                    </form>
                </section>
            </main>
        
        </div>
    );
}

export default AdicionarItem;