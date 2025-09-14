import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import invariant from 'tiny-invariant';

invariant(process.env.SLAWA_PASSWORD, 'process.env.SLAWA_PASSWORD missing');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'spidgorny@gmail.com',
    pass: process.env.SLAWA_PASSWORD,
  },
});

const mailOptions = {
  from: 'spidgorny@gmail.com',
  to: 'marina2stark@gmail.com, spidgorny@gmail.com',
  subject: 'Node.js Email Test',
  text: 'This is a test email from Nodemailer.',
  html: '<p>This is a <b>test</b> email.</p>',
};

function sendMailAsync(options: typeof mailOptions) {
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { subject, html } = body;
    const mailOptionsWithBody = {
      ...mailOptions,
      subject: subject || mailOptions.subject,
      html: html || mailOptions.html,
    };
    const result = await sendMailAsync(mailOptionsWithBody);
    return NextResponse.json({ success: true, response: result.response });
  } catch (error) {
    invariant(error instanceof Error, 'Unknown error type');
    return NextResponse.json(
      { success: false, error: error.message || error.toString() },
      { status: 500 }
    );
  }
}
