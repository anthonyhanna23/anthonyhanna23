import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, brand, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Lead from ${brand} (${name})`,
      text: `Name: ${name}\nEmail: ${email}\nBrand: ${brand}\n\nMessage:\n${message}`,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
}