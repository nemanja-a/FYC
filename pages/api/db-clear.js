import { connectToDatabase } from "../../util/mongodb";

export default async function handler(req, res) {
    const { db } = await connectToDatabase()
    const response = await db.collection("websites").deleteMany({ });
    res.json(response);
}