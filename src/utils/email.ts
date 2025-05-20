// src/utils/mailer.ts

import nodemailer from "nodemailer";
import { GET_ENV_VALUES } from "../config";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

const transporter = nodemailer.createTransport({
  host: GET_ENV_VALUES("SMTP_HOST"),
  port: Number(GET_ENV_VALUES("SMTP_PORT")),
  secure: GET_ENV_VALUES("SMTP_SECURE") === "true", // true for 465, false for other ports
  auth: {
    user: GET_ENV_VALUES("SMTP_USER"),
    pass: GET_ENV_VALUES("SMTP_PASS"),
  },
});

export async function sendEmail(options: EmailOptions): Promise<void> {
  const mailOptions = {
    from:
      options.from ||
      `"My App" <${GET_ENV_VALUES("SMTP_FROM") || GET_ENV_VALUES("SMTP_USER")}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Email sent: ${info.messageId}`);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw error;
  }
}
