import mailer from '../config/mailConfig.js';
import mailQueue from '../queues/mailQueue.js';

mailQueue.process(async (job) => {
    const emailData=job.data
  try {

    const response = await mailer.sendMail(emailData);
    console.log("Email sent Successfully",response)
  } catch (error) {
    console.log('Error comes from mail Processor.', error);
  }
});
