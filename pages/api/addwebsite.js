import { connectToDatabase } from "../../util/mongodb"
import { websiteExistInNearbyPages } from "../../lib/util";

// Find and update one 
export default async (req, res) => {
  const website = JSON.parse(req.body)
  const { db } = await connectToDatabase();
  // Handle when website exist on one or more pages
  const websiteInDatabase = await db.collection("websites").find({"websites.url": website.url}).toArray()
  const matchFound = websiteInDatabase.length && websiteExistInNearbyPages(websiteInDatabase, website.page)
  if (matchFound) return res.status(409).json({error: 'Website already exists'})
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
  data ? res.json({status: "Success", message: "Website added successfully"}) : res.status(400).json({error: "Error while adding website to database. Try again"});
};