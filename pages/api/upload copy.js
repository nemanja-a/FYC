import { ImageAnnotatorClient } from '@google-cloud/vision'
import { connectToDatabase,  } from '../../util/mongodb'
import fs from 'fs'
import { GridFSMiddleware } from '../../middleware/gridfs-middleware'
import nc from 'next-connect'

export default async (req, res) => {
  const { db } = await connectToDatabase()
  const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
  const CHUNKS_COLL = 'uploads.chunks';
  const FILES_COLL = 'uploads.files';
  // var readStream = fs.createReadStream('./LICENSE');
  const readStream = fs.createReadStream(req.file.path);
  
  fs.openUploadStream(req.file.name)
  const uploadStream = bucket.openUploadStream(req.file.name);

  uploadStream.once('finish', () => {
    bucket.save()
  })


    // Check if image has innapropriate content
  const image = JSON.parse(req.body)
  const projectId = 'famous-channels'
  const keyFilename = './famous-channels-f2d60f2dde10.json'

  const visionClient = new ImageAnnotatorClient({projectId, keyFilename})
  // const [result] = await visionClient.imageProperties(`./uploads/${image.filename}`);
  const [result] = await visionClient.labelDetection(image.filename)
  const labels = result.labelAnnotations;
  console.log('Labels:');
  // labels.forEach(label => console.log(label.description));
  labels.forEach(label => console.log(label));
  labels.length ? res.json({ok: false}) : res.json({ok: true})
}

export const config = {
  api: {
    bodyParser: false,
  },
}