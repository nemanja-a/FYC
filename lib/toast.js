import { toast } from 'react-toastify'

export const showError = (message) => { 
    const toastOptions = {
     position: "top-right",
     autoClose: 3000,
     hideProgressBar: false,
     closeOnClick: true,
     pauseOnHover: true,
     draggable: true,
     progress: undefined,
   }

   toast.dark(message, toastOptions)
 }