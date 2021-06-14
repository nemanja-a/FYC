import { connectToDatabase } from "../util/mongodb";


export default function Channels({channels}) {
    console.log(channels);
    return <h1>Hello</h1>
}

export async function getStaticProps() {
    const { db } = await connectToDatabase();
    const channels = await db
      .collection("channels")
      .find({})
      .limit(1000)
      .toArray();
    return {
      props: {
        channels: JSON.parse(JSON.stringify(channels)),
      },
    };
  }