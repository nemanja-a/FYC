import tableStyles from "../styles/table.module.css"
import 'react-virtualized/styles.css'
import { Header } from "../components/Header"
import React from "react"
import { MainContent } from "../components/MainContent"
import { JoinUs } from "../components/JoinUs"

export default function Channels() {
    return <div id="tableContainer" className={tableStyles.container}>
    <Header/>
    <MainContent />
    <JoinUs/>

    {/* {loading && <div className={tableStyles.title}>Loading...</div>} */}
  </div>
  }