import { Redis } from '@upstash/redis'

const cacheClient = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})


export {cacheClient}
