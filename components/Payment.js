import '@reach/dialog/styles.css'
import { useState } from 'react'
import dialogStyles from "../styles/dialog.module.css"
import paymentStyles from "../styles/payment.module.css"
import { Input } from './common/Input'
import PayPalComponent from "./PayPalComponent"
import utilStyles from "../styles/utils.module.css"
import { server } from '../config'
import { showError } from '../lib/toast'

export function Payment(props) {  
    const initialAmount = Number(localStorage.getItem('amount')) || 2
    const [amount, setAmount] = useState(initialAmount)
    
    const onAmountChange = () => { 
      const amount = Number(event.target.value)
      localStorage.setItem('amount', amount) 
      setAmount(amount)
    }

    const addWebsite = async () => {
      props.toggleLoading(true)
      const websiteFormData = props.getFormData()
      const addWebsiteURL = `${server}/api/addwebsite`
      const websiteResponse = await fetch(addWebsiteURL, {
        body: JSON.stringify(websiteFormData),
        method: 'POST'
      })
      if (websiteResponse.status === 500) {
        showError('Could not add website. Try again.')
        props.toggleLoading(false)  
      }
      const data = await websiteResponse.json()
      props.toggleLoading(false)
      props.close()
      return data
    }

    const onError = (message) => { 
       showError(message)
    }
    //toast.warn('Website added successfully!', toastOptions)
  return (
       <div id={dialogStyles.secondStep}>
            <div className={paymentStyles.content}>
                <span style={{padding: '1rem 0'}}>
                  <Input 
                      label='Amount in USD($)'
                      name='amount'
                      type='number'
                      onChange={onAmountChange}
                      value={amount}
                  />
                <span className={utilStyles.footnote}>Spot for your website costs 2€. However, if you like the idea behind this page, feel free to enter any other amount.</span>
                </span> 
                <span id={dialogStyles.payPalComponentWrapper}>
                    <PayPalComponent addWebsite={addWebsite} onError={onError}/>
                </span>
            </div>
        </div>
  )
}