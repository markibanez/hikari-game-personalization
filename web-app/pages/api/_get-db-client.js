import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = process.env.MONGODB_URI;
export const dbClient = new MongoClient(uri);

export const getDb = async () => {
    await dbClient.connect();
    return await dbClient.db('main');
}