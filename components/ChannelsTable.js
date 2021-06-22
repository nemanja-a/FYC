import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher, getTableParams } from "../lib/util"
import tableStyles from "../styles/table.module.css"
import { AddChannelDialog } from "./AddChannelDialog"
import Image from "next/image"
import { Table } from "react-virtualized"
import { ROWS_PER_PAGE } from "../util/variables";

export function ChannelsTable ({ index }) {
  let tableParams;
  const [tableContainer, setTableContainer] = useState('')

  useEffect(() => {
    const container = document.getElementById("tableContainer")
    setTableContainer(container)
  })

    tableParams = (tableContainer && !tableParams) && getTableParams(tableContainer)
    const computedCellStyles = tableParams && {
        'width': `${tableParams.cellWidth}`,
        'height': `${tableParams.rowHeight}`
      }
    const { data, error } = useSWR(tableParams ? `/api/channels?page=${Number(index)}` : null, fetcher) 

    // // ... handle loading and error states
    // if (error) return <div>failed to load</div>
    // if (!data) return <div>loading...</div>

    const rowGetter = ({index}) => { 
      if(!data) return {}

      const rowData = data.channels.filter(channel => {
        return channel.rowIndex === index
      })
      return rowData
    }
    const rowRenderer = (props) => {
      if (!Object.keys(props.rowData).length) return false
      return <div key={props.index} className={tableStyles.row}>
        {props.rowData.map(row => {
          // temp
          row.url = "https://source.unsplash.com/random"
          
          return row.isEmpty ? <AddChannelDialog 
           tableParams={tableParams}
           rowData={row} key={row.columnIndex}
           />
          : 
          <a
            href={row.url}
            target="_blank"
            key={row.columnIndex}
            style={{'width': tableParams.cellWidth, 'height': tableParams.rowHeight }}
            className={tableStyles.imageWrapper}
          >
          <Image
            priority
            // src={rowData.img_src}
            src="https://source.unsplash.com/random"
            className={tableStyles.channelImage}
            height={tableParams.rowHeight}
            width={tableParams.cellWidth}
            alt={row.url}
          />
        </a>
        })}
       </div>
    }
  
    return  <div id={tableStyles.tableWrapper}>
        {tableParams && <Table
            width={tableParams.tableWidth}
            height={tableParams.tableHeight}
            headerHeight={0}
            noRowsRenderer={() => <div>No data at the moment</div>}
            rowHeight={tableParams.rowHeight}
            // rowGetter={(index) => data && data.channels[index]}
            rowGetter={rowGetter}
            rowRenderer={rowRenderer}
            rowCount={ROWS_PER_PAGE}
            className={tableStyles.table}
            disableHeader={true}
          >
          </Table>}
      </div>
}