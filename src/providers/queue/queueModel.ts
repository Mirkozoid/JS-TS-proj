import { MongoClient } from 'mongodb';

const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri);

export async function connectToQueue() {
    await client.connect();
    const messageQueue = client.db('telegramBotDB').collection('messageQueue');
    return messageQueue;
}