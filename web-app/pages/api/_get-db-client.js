import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = process.env.MONGODB_URI;
export const dbClient = new MongoClient(uri, { keepAlive: true });
export let connected = false;

export const getDb = async () => {
    if (!connected) {
        await dbClient.connect();
        connected = true;
    }
    return await dbClient.db('main');
}