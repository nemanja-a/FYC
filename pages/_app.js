import { Provider, useSession } from 'next-auth/client'
import '../styles/reset.css';


function MyApp({ Component, pageProps }) {

  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
    //   <WebsitesProvider afterWebsiteAdded={pageProps.afterWebsiteAdded}>
    //   <Component {...pageProps} />
    // </WebsitesProvider>
  )
}
export default MyApp