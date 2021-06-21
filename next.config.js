module.exports = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/channels',
          permanent: true,
        },
      ]
    },
    images: {
      domains: ['yt3.ggpht.com', 'source.unsplash.com']
    },
    session: {
      jwt: true
    },
    // jwt: {
    //   encryption: true
    // }
    // basePath: '/channels',
  }