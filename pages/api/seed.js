import { connectToDatabase } from "../../util/mongodb"
 // Seed data
 export default async function handler(req, res) {
    const { db } = await connectToDatabase()
    const websites = await db.collection("websites").find({}).toArray()
    // if (websites.length) return res.json({ok: false, msg: "Seed aborted. Websites already exists"})
    let data = {}
        let columns = [];
        let pages = [];
        for (var rowCounter = 0; rowCounter < 15; rowCounter++) {
            for (var i = 0; i < 20; i++) {
                columns.push({columnIndex: i, rowIndex: rowCounter, id: '', isEmpty: true})
            }
            req.body = columns
        }
        for (var j = 0; j < 3334; j++) {
            pages.push({page: j, websites: req.body})
        }
        data = await db.collection("websites").insertMany(pages)
    res.json(data)
}


    // Delete all
    // export default async function handler(req, res) {
    //     const { db } = await connectToDatabase()
    //     const response = await db.collection("websites").deleteMany({ });
    //     res.json(response);
    // }