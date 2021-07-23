import { connectToDatabase } from "../../util/mongodb"
import { WebRiskServiceClient } from "@google-cloud/web-risk"
import { websiteExistInNearbyPages } from "../../lib/util"

export default async (req, res) => {
  const { db } = await connectToDatabase();
  const { url, page } = req.query

  // Case 1
  // Handle when website exist on one or more pages
  const websiteInDatabase = await db.collection("websites").find({"websites.url": url}).toArray()
  const matchFound = websiteInDatabase.length && websiteExistInNearbyPages(websiteInDatabase, Number(page))
  if (matchFound) return res.status(409).json({error: 'Website already exists'})
  // Case 1 end

  // Case 2
  // Validate Domain Name Server
  const isUrlValid = await fetch(url, { method: 'HEAD' });
  if (!isUrlValid.status === 200) {
    return res.status(404).json({error: `URL ${url} is not valid`})  
  }
  // Case 2 end


  // Case 3
  // Check if website has adult, medical, racy or any kind of disturbing content
  const projectId = 'famous-channels'
  const keyFilename = './famous-channels-f2d60f2dde10.json'
  const webRiskclient = new WebRiskServiceClient({projectId, keyFilename});
  const googleWebRiskRequest = {
    uri: url,
    threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'],
  };

  const {threat} = (await webRiskclient.searchUris(googleWebRiskRequest))[0];
  threat ? res.json({ok: false, msg: "The URL is marked as unsafe by Google Web Risk"}) : res.json({ok: true})
  // Case 3 end
}