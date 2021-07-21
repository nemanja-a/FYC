import loaderStyles from "../styles/loader.module.css"
export function TableLoader(props) {

    return <div id={loaderStyles.tableLoader} style={{display: props.loading ? "block" : "none"}}>
        <div className={loaderStyles.spinner}></div>
    </div>
}