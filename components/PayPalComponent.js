

import { useEffect, useRef } from "react"

const PayPalBtn = (props) => {

    const refPayPalBtn = useRef()
    useEffect(() => {
        paypal.Buttons({
            enableStandardCardFields: true, 
            createOrder: function(data, actions) {
              let amount = Number(localStorage.getItem('amount'))
              if (!amount) amount = 2
              // This function sets up the details of the transaction, including the amount and line item details.
              return actions.order.create({
                intent: 'CAPTURE',
                purchase_units: [{
                  amount: {
                    value: amount
                  }
                }]
              });
              
            },
            onApprove: async (data, actions) => {
              // This function captures the funds from the transaction.
              return actions.order.get().then(async(orderDetails) => {
                const addWebsiteResponse = await props.addWebsite()
                if (addWebsiteResponse.error) {
                  return props.onError(addWebsiteResponse.error)
                }
                return actions.order.capture().then(async(details) => {
                  // window.location.reload(false)
                });   
              })
             }
          }).render(refPayPalBtn.current);
          //This function displays Smart Payment Buttons on your web page.
        
    }, [])
    return(
        <div ref={refPayPalBtn} id='pay-pal-btn'></div>
    )
}

export default PayPalBtn