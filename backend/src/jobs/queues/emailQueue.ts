import { Queue } from 'bullmq';
import { redisConnection, defaultJobOptions } from '../../config/redis';

export const emailQueue = new Queue('emails', {
  connection: redisConnection,
  defaultJobOptions,
});
