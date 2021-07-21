import loaderStyles from "../styles/loader.module.css"
export function ModalLoader() {

    return <div id={loaderStyles.modalLoader}>
        <div className={loaderStyles.spinner}></div>
    </div>
}