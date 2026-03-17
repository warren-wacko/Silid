import { Worker, Job } from 'bullmq';
import { redisConnection } from '../../config/redis';
import crypto from 'crypto';

interface WebhookJob {
  url: string;
  event: string;
  payload: object;
  secret: string;
}

const webhookWorker = new Worker(
  'webhooks',
  async (job: Job<WebhookJob>) => {
    console.log(`Processing webhook job ${job.id}`);

    const { url, event, payload, secret } = job.data;

    const body = JSON.stringify({ event, payload });

    const signature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Silid-Signature': signature,
        'X-Silid-Event': event,
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`Webhook failed with status ${response.status}`);
    }

    console.log(`Webhook delivered to ${url} for event ${event}`);
  },
  {
    connection: redisConnection,
    concurrency: 10,
  }
);

webhookWorker.on('completed', (job: Job) => {
  console.log(`Webhook job ${job.id} completed`);
});

webhookWorker.on('failed', (job: Job | undefined, error: Error) => {
  console.error(`Webhook job ${job?.id} failed:`, error.message);
});

export default webhookWorker;
