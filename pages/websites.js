import tableStyles from "../styles/table.module.css"
import 'react-virtualized/styles.css'
import { Header } from "../components/Header"
import React from "react"
import { MainContent } from "../components/MainContent"
import { ToastContainer } from "react-toastify"
import Meta from "../components/common/Meta"
import utilStyles from "../styles/utils.module.css"

export default function Websites() {
    return <div id="tableContainer" className={tableStyles.container}>
      <Meta title="World in 2021" />
      <ToastContainer />
      <div style={{margin: 'auto'}}>
        <Header/>
        <MainContent />
        <div id={utilStyles.footerDescription}>
          Year 2021. Fight against COVID-19 still persists. Our daily lives has changed a lot since when pandemic started and it made us turn to digital technologies even more. <br/>
          Find out what are people up to during 2021.
        </div>
        <div id={utilStyles.footer}>
          <strong>*Disclaimer: Images on this page are copywright of their owners. I am not responsible for the content of external sites.</strong>
          <strong>Copyright © World in 2021 © Nemanja Apostolovic</strong>
        </div>

      </div>
  </div>
  }