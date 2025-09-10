import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  try {
    // 1. Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // e.g., "smtp.gmail.com"
      port: process.env.EMAIL_PORT, // e.g., 465 (SSL) or 587 (TLS)
      secure: process.env.EMAIL_PORT == 465, // true for 465, false for others
      auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASS, // your email app password
      },
    });

    // 2. Define mail options
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html, // optional
    };

    // 3. Send email
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Email not sent:", error.message);
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;
