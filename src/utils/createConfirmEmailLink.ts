import { v4 as uuid } from 'uuid';
import { Redis } from 'ioredis';

export const createConfirmEmailLink = async (
    url: string,
    userId: string | null,
    redis: Redis
) => {
    const id = uuid();
    await redis.set(id, userId, "ex", 60 * 60 * 24);
    return `${url}/confirm/${id}`;
};