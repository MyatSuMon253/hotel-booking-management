import nodemailer from "nodemailer";

type EmailOptions = {
  customer_email: string;
  subject: string;
  body: string;
};

export const sendEmail = async (options: EmailOptions) => {
  var transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.customer_email,
    subject: options.subject,
    html: options.body,
  };

  await transport.sendMail(message);
};
