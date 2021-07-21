import { connectToDatabase } from "../../util/mongodb"

// Find and update one 
export default async (req, res) => {
  const website = JSON.parse(req.body)
  const { db } = await connectToDatabase();
  const existingWebsite = await db.collection("websites").findOne({"websites.url": website.url})
  if (existingWebsite) {
    res.status(409).json({error: "Website already exists"})
  }
  const page = await db.collection("websites").findOne({page: website.page})
  const updatedPage = JSON.parse(JSON.stringify(page));
  
  for (var i = 0; i < updatedPage.websites.length; i++) {
   if (updatedPage.websites[i].rowIndex === website.rowIndex && updatedPage.websites[i].columnIndex === website.columnIndex) {
        updatedPage.websites[i] = website
        break
    }
  }

  delete updatedPage._id
  const data = await db.collection("websites").findOneAndReplace(page, updatedPage);
  // res.json(data);
  res.status(404).json({error: "Testiram"})
};