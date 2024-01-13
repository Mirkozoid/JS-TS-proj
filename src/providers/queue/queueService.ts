import { connectToQueue } from './queueModel';

export async function addToQueue(item: any) {
    const queue = await connectToQueue();
    await queue.insertOne(item);
    console.log('Элемент добавлен в очередь');
}

export async function removeFromQueue(remove = false) {
    const queue = await connectToQueue();
    const item = await queue.findOne({});
    if (item) {
        console.log('Элемент получен из очереди');
        if (remove) {
            await queue.deleteOne({ _id: item._id });
            console.log('Элемент удален из очереди');
        }
        console.log(item);
        return item;
    }
    return null;
}