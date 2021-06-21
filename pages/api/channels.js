import { connectToDatabase } from "../../util/mongodb"

    // Get Channels
    export default async function handler(req, res) {
        const { db } = await connectToDatabase()
          const query = req.query
          const channels = await db
              .collection("channels")
              .findOne({page: Number(query.page)})
              res.json(channels)
    }

    // Seed data
    // export default async function handler(req, res) {
    //     const { db } = await connectToDatabase()
    //     let data = {}
    //         let columns = [];
    //         let pages = [];
    //         for (var rowCounter = 0; rowCounter < 15; rowCounter++) {
    //             for (var i = 0; i < 20; i++) {
    //                 columns.push({columnIndex: i, rowIndex: rowCounter, isEmpty: true})
    //             }
    //             req.body = columns
    //         }
    //         for (var j = 0; j < 3334; j++) {
    //             pages.push({page: j, channels: req.body})
    //         }
    //         data = await db.collection("channels").insertMany(pages)
    //     res.json(data)
    // }


    // Delete all
    // export default async function handler(req, res) {
    //     const { db } = await connectToDatabase()
    //     const response = await db.collection("channels").deleteMany({ });
    //     res.json(response);
    // }