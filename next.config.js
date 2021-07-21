module.exports = {
    async redirects() {
      return [
        {
          source: '/',
          destination: '/websites',
          permanent: true,
        },
      ]
    },
    images: {
      domains: ['res.cloudinary.com']
    },
    session: {
      jwt: true
    },
    env: {
      BASE_API_URL: 'http://localhost:3000/api'
    }
  }