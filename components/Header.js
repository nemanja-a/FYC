import '@reach/dialog/styles.css'
import styles from "../styles/header.module.css"
import utilStyles from "../styles/utils.module.css"
import Image from "next/image"

export function Header(props) {
  return (
    <div id="header" className={utilStyles.displayFlex}>
      <div id={styles.textContent}>
        <div id={styles.appName}>Best of <span>2021</span></div>
        <div id={styles.appDescription}>Up to one milion websites</div>
      </div>
    </div>
  )
}