import { Queue } from 'bullmq';
import { redisConnection, defaultJobOptions } from '../../config/redis';

export const webhookQueue = new Queue('webhooks', {
  connection: redisConnection,
  defaultJobOptions,
});
