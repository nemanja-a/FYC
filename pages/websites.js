import tableStyles from "../styles/table.module.css"
import 'react-virtualized/styles.css'
import { Header } from "../components/Header"
import React from "react"
import { MainContent } from "../components/MainContent"
import { JoinUs } from "../components/JoinUs"
import { ToastContainer } from "react-toastify"
import Meta from "../components/common/Meta"

export default function Websites() {
    return <div id="tableContainer" className={tableStyles.container}>
      <Meta title="Best of 2021" />
      <ToastContainer />
      <div>
        <Header/>
        <MainContent />
      </div>
    <JoinUs/>
  </div>
  }