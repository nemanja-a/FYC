import jwt from 'next-auth/jwt';

export default async (req, res) => {
  let accessToken;
  const secret = process.env.JWT_SECRET

  const token = await jwt.getToken({ req, secret })
  accessToken = token.accessToken;
  const youTubeAPIurl = "https://youtube.googleapis.com/youtube/v3/channels?part=snippet&mine=true&key="  + process.env.GOOGLE_API_KEY
  const youTubeAPIres = await fetch(youTubeAPIurl, {
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Accept': 'application/json',
        'credentials': 'include'
      }
  })
  const youTubeData = await youTubeAPIres.json();
  const channelID = req.query.id
  const channel = youTubeData.items.length && youTubeData.items.find(item => {
      return item.id === channelID
  })
  channel ? res.json({isValid: true}) : res.json({isValid: false})
};
