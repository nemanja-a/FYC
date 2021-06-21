import '@reach/dialog/styles.css'
import styles from "../styles/header.module.css"
import utilStyles from "../styles/utils.module.css"
import Image from "next/image"

export function Header(props) {
  return (
    <div id="header" className={utilStyles.displayFlex}>
      <div id={styles.logo}>
        <Image
            priority
            src="/public/Logo.svg"
            height={50}
            width={50}
            alt="Famous YouTube Channels"
        />
      </div>
      <div id={styles.textContent}>
        <div id={styles.appName}>Famous YouTube Channels</div>
        <div id={styles.appDescription}>Welcome to YouTube hall of fame! (or some text that makes you super excited  about this!)</div>
      </div>
    </div>
  )
}