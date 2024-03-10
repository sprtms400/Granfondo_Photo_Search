import amqp from 'amqplib';

export const requestAnalyzeAppearance = async function (photoId: string){
    const conn = await amqp.connect('amqp://localhost');
    const channel = await conn.createChannel();

    const queue = 'analyzingQueueAppearance';
    const msg = photoId;
    const body = {
        photoId: photoId
    }
    await channel.assertQueue(queue, {durable: true}); // Queue가 없을시 생성
    const result = channel.sendToQueue(queue, Buffer.from(msg));
    console.log(' [x] Sent %s', msg);
    return result;
}

export const requestAnalyzeNumberPlate = async function (photoId: string){
    const conn = await amqp.connect('amqp://localhost');
    const channel = await conn.createChannel();

    const queue = 'analyzingQueueNumberPlate';
    const msg = photoId;

    await channel.assertQueue(queue, {durable: true}); // Queue가 없을시 생성
    const result = channel.sendToQueue(queue, Buffer.from(msg));
    console.log(' [x] Sent %s', msg);
    return result;
}

// export function requestAnalyzeAppearance(photoId: string) {
//     return new Promise(async (resolve, reject) => {
//         const conn = await amqp.connect('amqp://localhost');
//         const channel = await conn.createChannel();

//         const queue = 'analyzingQueueAppearance';
//         const msg = photoId;

//         await channel.assertQueue(queue, {durable: false}); // Queue가 없을시 생성 
//         const result = channel.sendToQueue(queue, Buffer.from(msg));
//         console.log(' [x] Sent %s', msg);
//         if (result) {
//             resolve(result);
//         } else {
//             reject(result);
//         }
//     });
// }

// export function requestAnalyzeNumberPlate(photoId: string) {
//     return new Promise(async (resolve, reject) => {
//         const conn = await amqp.connect('amqp://localhost');
//         const channel = await conn.createChannel();

//         const queue = 'analyzingQueueNumberPlate';
//         const msg = photoId;

//         await channel.assertQueue(queue, {durable: false}); // Queue가 없을시 생성
//         const result = channel.sendToQueue(queue, Buffer.from(msg));
//         console.log(' [x] Sent %s', msg);
//         if (result) {
//             resolve(result);
//         } else {
//             reject(result);
//         }
//     });
// }