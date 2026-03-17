import { Worker, Job } from 'bullmq';
import { redisConnection } from '../../config/redis';

interface EmailJob {
  to: string;
  subject: string;
  body: string;
}

const emailWorker = new Worker(
  'emails',
  async (job: Job<EmailJob>) => {
    console.log(`Processing email job ${job.id}`);
    console.log(`Sending email to: ${job.data.to}`);
    console.log(`Subject: ${job.data.subject}`);
    console.log(`Body: ${job.data.body}`);

    // In production this is where you'd use Nodemailer or Resend:
    // await sendEmail(job.data.to, job.data.subject, job.data.body)

    console.log(`Email sent successfully to ${job.data.to}`);
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

emailWorker.on('completed', (job: Job) => {
  console.log(`Email job ${job.id} completed`);
});

emailWorker.on('failed', (job: Job | undefined, error: Error) => {
  console.error(`Email job ${job?.id} failed:`, error.message);
});

export default emailWorker;
