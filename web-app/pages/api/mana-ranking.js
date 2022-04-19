import { getDb } from './_get-db-client';

const handler = async (req, res) => {
    const db = await getDb();
    const rankings = await db.collection("Mana Ranking").find({}).limit(200).toArray();

    res.json(rankings);
}

export default handler;
