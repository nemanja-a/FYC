import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import {jwt } from "next-auth/jwt"

const options = {
    providers: [
        Providers.Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
        }),
    ],
    secret: process.env.AUTH_SECRET,
    session: {
        jwt: true
    },
    callbacks: {
        async jwt(token, user, account, profile, isNewUser) {
          if (account?.accessToken) {
            token.accessToken = account.accessToken
          }
          return token
        },
        async session(session, token) {
          const encodedToken = jwt.sign(token, process.env.SECRET, { algorithm: 'HS256'});
          session.accessToken = encodedToken;
          return session
            // session.accessToken = token.accessToken
            // return session
        }
      }
}

export default (req, res) => NextAuth(req, res, options)