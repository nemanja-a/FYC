import React from "react";
import useSWR from "swr";
import { fetcher, getTableParams } from "../lib/util"
import tableStyles from "../styles/table.module.css"
import { AddChannelDialog } from "./AddChannelDialog"
import Image from "next/image"
import utilStyles from "../styles/utils.module.css"

export function ChannelsTable ({ index, containerRef, setTotalPageCount }) {
    let tableData = {
      rowHeight: 30,
      cellWidth: 30
    }

    const tableParams = containerRef.current && getTableParams(tableData, containerRef.current)
    const { data, error } = useSWR(containerRef.current ? `/api/channels?page=${index}&limit=${tableParams.limit}` : null, fetcher)
    data && setTotalPageCount(data.totalPageCount) 

    // // ... handle loading and error states
    // if (error) return <div>failed to load</div>
    // if (!data) return <div>loading...</div>
  
    return  <div id="channels-table">
        <table className={tableStyles.table}>
    <tbody>
        {(data && data.channels.map(row => {
          //temp
          row.rowIndex = Math.floor(Math.random() * 10000000)

          return <tr key={row.rowIndex}>
          {row.columns.map(channel => {
            //temp
            channel.columnIndex = Math.floor(Math.random() * 10000000)
            return <td key={channel.columnIndex}>
              {channel.isEmpty ? <AddChannelDialog rowData={channel}/>
              :
              <a href={channel.url} target="_blank">
              <Image
                priority
                // src={rowData.img_src}
                src="https://yt3.ggpht.com/LWGGo-mrbIl-3dG5Q3ZWrfnN0FLy7uVKsiCYVi5sdCfFde-BUgRU3yp_koPf0I8yIt8iSoBenXw=s176-c-k-c0x00ffffff-no-rj"
                className={utilStyles.borderRounded}
                height={30}
                width={30}
                alt={channel.url}
              />
          </a>
              }       
            </td>
          })}
        </tr>
        }))}
    </tbody>
</table>
      </div>
}