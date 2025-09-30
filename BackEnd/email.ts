import nodemailer from "nodemailer";

export async function sendEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: "smtp.example.com", // z. B. smtp.gmail.com
    port: 587,
    secure: false,
    auth: {
      user: "deine@email.de",
      pass: "deinPasswortOderAppToken",
    },
  });

  await transporter.sendMail({
    from: '"Dein Projekt" <deine@email.de>',
    to,
    subject,
    html,
  });
}