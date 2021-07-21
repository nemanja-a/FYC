import cloudinary from 'cloudinary'

export default async (req, res) => {
  const deleteImageResponse = await cloudinary.v2.uploader.destroy(req.query.filename)
  res.json(deleteImageResponse)
}