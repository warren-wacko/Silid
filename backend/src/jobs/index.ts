import emailWorker from './workers/emailWorker';
import webhookWorker from './workers/webhookWorker';

console.log('Workers started');
console.log('Email worker ready');
console.log('Webhook worker ready');

export { emailWorker, webhookWorker };
