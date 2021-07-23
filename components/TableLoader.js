import loaderStyles from "../styles/loader.module.css"
export function TableLoader(props) {

    return <div id={loaderStyles.tableLoader}>
        <div className={loaderStyles.spinner}></div>
    </div>
}