import React, { useState } from "react"
import { WebsitesTable } from "./WebsitesTable"
import paginationStyles from "../styles/pagination.module.css"
import { NAVIGATION_BUTTONS_COUNT, TOTAL_PAGE_COUNT } from "../util/variables"
import tableStyles from '../styles/table.module.css'
import { classNames } from "../lib/util"
import { Input } from "./common/Input"

export function MainContent () {
    const [ state, setState ] = useState({
      pageIndex: 0,
      pageRangeStart: 0,
    })

    const handleGoToPageEnterKey = (control) => { 
      if (control.eventKey === 'Enter') {
        if (control.value >= TOTAL_PAGE_COUNT - NAVIGATION_BUTTONS_COUNT && control.value <= TOTAL_PAGE_COUNT) {
          setState({...state, pageRangeStart: TOTAL_PAGE_COUNT - NAVIGATION_BUTTONS_COUNT, pageIndex: TOTAL_PAGE_COUNT - (TOTAL_PAGE_COUNT - control.value) })
        } else if (control.value <= TOTAL_PAGE_COUNT) {
          setState({...state, pageRangeStart: control.value, pageIndex: control.value})
        }
      }
    }

    const goToPageWrapperClasses = classNames({
      [paginationStyles.goToPageInputWrapper]: true
    })
    const goToPageClasses = {
      wrapper: goToPageWrapperClasses
    }

    const previousButtonDisabled = !state.pageIndex
    const nextButtonDisabled = state.pageIndex > TOTAL_PAGE_COUNT - 1
    
    const navigationButton = (pageIndex, buttonIndex) => {
      return <button 
        id={buttonIndex} 
        className={pageIndex === state.pageIndex ? paginationStyles.activePage : null} 
        onClick={() => setState({...state, pageIndex})}>{pageIndex}
      </button>
    }
    const rangeButton = (text, disabled, onClick) => <button disabled={disabled} onClick={onClick}>{text}</button> 
    const onFirstPageClicked = () => setState({loading: true, pageRangeStart: 0, pageIndex: 0})
    const onRangeButtonClicked = (pageRangeStart) => { setState({loading: true, pageRangeStart, pageIndex: pageRangeStart}) }
    const onLastPageClicked = () => setState({loading: true, pageRangeStart: TOTAL_PAGE_COUNT - NAVIGATION_BUTTONS_COUNT, pageIndex: TOTAL_PAGE_COUNT})

    return <div id={tableStyles.mainContent}>
      <div id={paginationStyles.pagination}>
        <div id={paginationStyles.paginationWrapper}>
          {rangeButton('First', previousButtonDisabled, onFirstPageClicked)}
          {rangeButton('<< Previous', previousButtonDisabled, onRangeButtonClicked.bind(this, state.pageIndex - 1))}
          {navigationButton(state.pageRangeStart, 1)}
          {navigationButton(state.pageRangeStart + 1, 2)}
          {navigationButton(state.pageRangeStart + 2, 3)}
          {navigationButton(state.pageRangeStart + 3, 4)}
          {navigationButton(state.pageRangeStart + 4, 5)}
          {navigationButton(state.pageRangeStart + 5, 6)}
          {rangeButton('Next >>', nextButtonDisabled, onRangeButtonClicked.bind(this, state.pageIndex + 1))}
          {rangeButton('Last', nextButtonDisabled, onLastPageClicked)}
          
          <Input 
            label='Go To Page'
            type="number"
            name='page'
            min="0"
            max="3333"
            classes={goToPageClasses}
            onKeyDown={handleGoToPageEnterKey}
          />        
        </div>
      </div>
      <WebsitesTable pageIndex={state.pageIndex}/>
    </div>
}

