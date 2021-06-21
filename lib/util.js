import {ROWS_PER_PAGE, COLUMNS_PER_ROW } from "../util/variables"

export function getTableParams (container) {
    let tableParams = {
        tableHeight: container.offsetHeight,
        tableWidth: container.offsetWidth,
        rowHeight: Math.round(container.offsetHeight / ROWS_PER_PAGE - 2),
        cellWidth: Math.round(container.offsetWidth / COLUMNS_PER_ROW)
    }
    return tableParams
}

export const fetcher = (...args) => fetch(...args).then(res => res.json())