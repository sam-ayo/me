import { createClient } from 'redis';

const cacheClient = createClient();

cacheClient.on('error', err => console.log('Redis Client Error', err));

await cacheClient.connect();

export {cacheClient}
