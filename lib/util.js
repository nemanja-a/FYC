import {ROWS_PER_PAGE, COLUMNS_PER_ROW } from "../util/variables"
import { useEffect } from "react"

export function getTableParams (container) {
     return {
        tableHeight: container.offsetHeight - 20,
        tableWidth: container.offsetWidth,
        rowHeight: Math.round(container.offsetHeight / ROWS_PER_PAGE - 2),
        cellWidth: Math.round(container.offsetWidth / COLUMNS_PER_ROW)
     }
}

export const fetcher = (...args) => fetch(...args).then(res => res.json())

export function classNames(namesObject) {
    let classes = []
  
    for (let key in namesObject) {
      if (namesObject[key]) {
        classes.push(key)
      }
    }
  
    return classes.join(" ")
  }

  export function getIncrementerValue(value, direction) {
    if (direction === 'down' && value <= 89) {
        value += 1
    } else if (direction === 'up' && value >= 0) {
        value -= 1 
    }
     return value
  }

  export function useClickOutside(ref, handler) {
    useEffect(() => {
      let startedInside = false
      let startedWhenMounted = false

      const listener = (event) => {
        // Do nothing if `mousedown` or `touchstart` started inside ref element
        if (startedInside || !startedWhenMounted) return
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) return

        handler(event)
      }

      const validateEventStart = (event) => {
        startedWhenMounted = ref.current
        startedInside = ref.current && ref.current.contains(event.target)
      }

      document.addEventListener("mousedown", validateEventStart)
      document.addEventListener("touchstart", validateEventStart)
      document.addEventListener("click", listener)

      return () => {
        document.removeEventListener("mousedown", validateEventStart)
        document.removeEventListener("touchstart", validateEventStart)
        document.removeEventListener("click", listener)
      }
    }, [ref, handler])
  }

  export const hasUnsafeContent = (detections) => { 
    let hasUnsafeContent = false
    Object.entries(detections).find(pair => { 
      if (pair[1] === 'VERY_LIKELY' && pair[0] !== 'spoof')
        hasUnsafeContent = true
    })
    return hasUnsafeContent
  }

  export const websiteExistInNearbyPages = (websiteInDatabase, page) => {
      let matchFound = false
      for (var i = 0; i < websiteInDatabase.length; i++) {
        if (page === websiteInDatabase[i].page) {
          matchFound = true
          break
        }
        if (page > websiteInDatabase[i].page) {
          if (page < websiteInDatabase[i].page + 10) {
            matchFound = true
            break
          }
        }
        if (page < websiteInDatabase[i].page) {
          if (page > websiteInDatabase[i].page - 10) {
            matchFound = true
            break
          }
        }
      }
      return matchFound
  }

  export const hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }