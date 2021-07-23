import Document, { Html, Head, Main, NextScript } from 'next/document'
import { useEffect } from 'react';

class MyDocument extends Document {
 

  render() {
    return (
      <Html>
        <Head>
          {/* <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab&display=swap" rel="stylesheet" /> */}
          <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet"></link>
          <script defer src={`https://www.paypal.com/sdk/js?client-id=${process.env.PAYPAL_CLIENT_ID}&currency=EUR`} />
          {/* TODO: Improve SEO by adding more meta tags  */}
          <meta name="keywords" content="websites, bestof2021, covid"></meta>
          {/* <script src={`https://www.paypal.com/sdk/js?client-id=sb&currency=EUR`} />  */}
          {/* <script src={`https://www.paypal.com/sdk/js?client-id=sb`} /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument