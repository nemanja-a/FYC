import { connectToDatabase } from "../../../util/mongodb"

export default async (req, res) => {
  const db = await connectToDatabase();
  
  if (req.method === "GET") { 
    const token = req.token
    const user = await db.collection("users").find({accessToken: token})
    res.status(200).json(user)
  } else if (req.method === "POST") {
      const user = req.body
      const data = await db.collection("users").insertOne(user)
      res.status(200).json(data)
  }
};