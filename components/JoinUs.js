import tableStyles from "../styles/table.module.css"
import { signIn } from "next-auth/client"
import { useSession } from "next-auth/client"

export function JoinUs() {
    const [session] = useSession()

    const handleLogin = (e) => {
      e.preventDefault()
      signIn('google')
    }

    return <div id="join-us">
     {!session && <div className={tableStyles.joinFirstStep}>
        <span>How about this - for 1€ (or how much you want) take a place in here and let few more people know about your channel...</span>
        <span>Only you can add your channel, so 
        <a href="#" onClick={handleLogin} className="btn-signin"> Sign in </a>
         with Google (some funny text that will make you realise we know it's you, but we still have to check) and let's roll! </span>
        </div>}

      {(session)  && <div className={tableStyles.joinSecondStep}>
        <span>Wow, you really want to do this? Are you sure you don't want to get a drink instead? Tea is amazing thing, you know...</span>
        <span>Allright, then! Pick a place here (or on any other page) that suits you and show us what you got!</span>
      </div>}
    </div>
}