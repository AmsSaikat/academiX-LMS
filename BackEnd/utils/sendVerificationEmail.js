import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use SMTP
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      }
    });

    const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    const mailOptions = {
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email",
      html: `
        <h3>Email Verification</h3>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationLink}" style="color:blue">${verificationLink}</a>

        <p>This link expires in 15 minutes.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    console.log("Verification email sent to:", email);
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send verification email");
  }
};
