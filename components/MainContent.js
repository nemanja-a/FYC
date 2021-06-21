import React, { useState } from "react";
import { ChannelsTable } from "./ChannelsTable";
import paginationStyles from "../styles/pagination.module.css"
import { TOTAL_PAGE_COUNT } from "../util/variables";

export function MainContent () {
    const [ pageIndex, setPageIndex ] = useState(0)

    return <div id="main-content">
      <ChannelsTable index={pageIndex}/>
      <div style={{ display: 'none' }}><ChannelsTable index={pageIndex + 1}/></div>
      <div id={paginationStyles.pagination}>
        <button disabled={!pageIndex} onClick={() => pageIndex && setPageIndex(0)}>First page</button>
        <button disabled={!pageIndex} onClick={() => pageIndex && setPageIndex(pageIndex - 1)}>Previous</button>
        <button disabled={!pageIndex} onClick={() => pageIndex && setPageIndex(pageIndex - 1)}>{pageIndex ? pageIndex - 1: pageIndex}</button>
        <button id="current-page">{pageIndex}</button>
        <button disabled={pageIndex > TOTAL_PAGE_COUNT - 3} onClick={() => setPageIndex(pageIndex + 1)}>{pageIndex + 1}</button>
        <button disabled={pageIndex > TOTAL_PAGE_COUNT - 3} onClick={() => setPageIndex(pageIndex + 1)}>Next</button>
        <button disabled={pageIndex > TOTAL_PAGE_COUNT - 3} onClick={() => setPageIndex(TOTAL_PAGE_COUNT - 3)}>Last page</button>
      </div>
    </div>
}