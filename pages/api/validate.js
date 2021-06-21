import jwt from 'next-auth/jwt';
const secret = process.env.JWT_SECRET;
let accessToken;

export default async (req, res) => {
  const token = await jwt.getToken({ req, secret, algorithm: 'HS256' })
  accessToken = token.accessToken;
  const youTubeAPIurl = "https://youtube.googleapis.com/youtube/v3/channels?part=snippet&mine=true&key="  + process.env.GOOGLE_API_KEY
  const youTubeAPIres = await fetch(youTubeAPIurl, {
      headers: {'Authorization': 'Bearer ' + accessToken}
  })
  const youTubedata = await youTubeAPIres.json();
  const channelID = req.body.channelID
  const channel = youTubedata.items.length && youTubedata.items.find(item => {
      return item.id === channelID
  })
  const errorMsg = "Well, boss, only channel owners can add their channels here. Do it one more time, we know you have the real things to show!"
  if (!channel) { 
    return res.status(400).json(errorMsg);
  } 
  res.json({isValid: true});
};