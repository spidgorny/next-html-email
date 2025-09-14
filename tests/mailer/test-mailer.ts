import nodemailer from 'nodemailer';
import invariant from 'tiny-invariant';
import { runTest } from '../bootstrap';

invariant(process.env.SLAWA_PASSWORD, 'process.env.SLAWA_PASSWORD missing');

// Step 1: Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'spidgorny@gmail.com',
    pass: process.env.SLAWA_PASSWORD,
  },
});

// Step 2: Define email content
const mailOptions = {
  from: 'spidgorny@gmail.com',
  to: 'marina2stark@gmail.com, spidgorny@gmail.com',
  subject: 'Node.js Email Test',
  text: 'This is a test email from Nodemailer.',
  html: '<p>This is a <b>test</b> email.</p>',
};

// Step 3: Send the email
async function sendMailAsync(options: typeof mailOptions) {
  return new Promise<{ response: string }>((resolve, reject) => {
    transporter.sendMail(options, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve({ response: info.response });
      }
    });
  });
}

void runTest(async () => {
  try {
    const result = await sendMailAsync(mailOptions);
    console.log('Email sent:', result.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
});
