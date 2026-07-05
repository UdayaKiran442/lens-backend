import { Redis } from "@upstash/redis";
import { ActiveConfig } from "../utils/config.utils";

const redis = new Redis({
    url: ActiveConfig.UPSTASH_REDIS_REST_URL,
    token: ActiveConfig.UPSTASH_REDIS_REST_TOKEN,
})

export default redis;
 