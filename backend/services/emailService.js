const nodemailer = require("nodemailer");

const getTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    const error = new Error("Missing SMTP configuration in environment variables.");
    error.statusCode = 500;
    throw error;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

const sendContactEmail = async ({ firstName, lastName, email, phone, message }) => {
  const transporter = getTransporter();
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    const error = new Error("ADMIN_EMAIL is not configured.");
    error.statusCode = 500;
    throw error;
  }

  const subject = "New LearnCraft Contact Message";
  const fullName = `${firstName || ""} ${lastName || ""}`.trim() || "Not provided";
  const textBody = [
    `Name: ${fullName}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    "",
    message,
  ].join("\n");

  await transporter.sendMail({
    from: `LearnCraft <${process.env.SMTP_USER}>`,
    to: adminEmail,
    replyTo: email,
    subject,
    text: textBody,
  });
};

module.exports = { sendContactEmail };
