import React, { useEffect, useRef, useState } from "react"
import useSWR from "swr"
import { classNames, fetcher, getTableParams } from "../lib/util"
import tableStyles from "../styles/table.module.css"
import { AddWebsiteDialog } from "./AddWebsiteDialog"
import Image from "next/image"
import { Table } from "react-virtualized"
import { ROWS_PER_PAGE, WEBSITE } from "../util/variables"
import { TableLoader } from "./TableLoader"

export function WebsitesTable ({ pageIndex }) {
  let tableParams;
  const [ tableContainer, setTableContainer ] = useState('')
  const [ afterAddSuccess, setAfterAddSuccess ] = useState(false)
  let loading = true;

  useEffect(() => {
    const container = document.getElementById("tableContainer")
    setTableContainer(container)
  })

    tableParams = (tableContainer && !tableParams) && getTableParams(tableContainer)
    // if (tableParams && loading) data = null
    let { data, error } = useSWR(tableParams ? `/api/websites?page=${Number(pageIndex)}` : null, fetcher) 
    
    if (!data) return <TableLoader/>
    loading = false

    const rowGetter = ({index}) => { 
      if(!data) return {}

      const rowData = data.websites.filter(website => {
        return website.rowIndex === index
      })
      return rowData
    }

    const onWebsiteClick = (websiteUrl) => {
      window.open(websiteUrl, '_blank')
    }

    const rowRenderer = (props) => {
      if (!Object.keys(props.rowData).length) return false

      loading = true
      return <div key={props.index} className={tableStyles.row}>
        {props.rowData.map((cell, index) => {
          const cellClasses = classNames({
            [tableStyles.cell]: true,
            [tableStyles.firstCellInRow]: !cell.columnIndex
          })
          cell.page = pageIndex
          if (props.rowData.length === index) {
            loading = false
          }
          
          // 'top' style calculation is based on image preview dimensions inside AddWebsitelDialog.js 
          return cell.isEmpty ? <AddWebsiteDialog 
           tableParams={tableParams}
           website={cell} key={cell.columnIndex}
           afterAddSuccess={() => setAfterAddSuccess(true)}
           />
          : 
          <div
           key={`${cell.rowIndex}-${cell.columnIndex}`} 
           className={cellClasses}
           onClick={() => onWebsiteClick(cell.url)}
           >
            <Image
              src={cell.thumbnail.url || WEBSITE.THUMBNAIL.DEFAULT}
              className={tableStyles.websiteImage}
              layout="fill"
              alt='No image found'
            />
            <span             
              id={tableStyles.websiteTitle}
              style={{
                opacity: cell.titleOpacity < 10 ? `0.${cell.titleOpacity}` : 1,
                color: cell.titleColor,
                background: cell.titleBackgroundColor,              
                top: `${cell.titlePosition}%`,
                height: `${cell.titleHeight / 4}px`
              }} 
            >
            {cell.title ? cell.title : null}</span>

              <span                    
              id={tableStyles.websiteDescription}
              style={{          
                opacity: cell.descriptionOpacity < 10 ? `0.${cell.descriptionOpacity}` : 1,
                color: cell.descriptionColor,
                background: cell.descriptionBackgroundColor,
                top: cell.descriptionPosition + 11 + "%",
                height: `${cell.descriptionHeight / 4}px`
              }}
            >
              {cell.description ? cell.description : null}</span>
          </div>
          
        })}
       </div>
    }
  
    // return  <div id={tableStyles.tableWrapper}>
    return  <div>
        {tableParams && <Table
            width={tableParams.tableWidth}
            height={tableParams.tableHeight}
            headerHeight={0}            
            rowHeight={tableParams.rowHeight}
            rowGetter={rowGetter}
            rowRenderer={rowRenderer}
            rowCount={ROWS_PER_PAGE}
            className={tableStyles.table}
            disableHeader={true}
          >
          </Table>}
      </div>
}