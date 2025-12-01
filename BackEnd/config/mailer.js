import nodemailer from "nodemailer";

export const sendTestMail = () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: "yourFriend@yahoo.com",
    subject: "Sending Email using Node.js",
    text: "That was easy!",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("❌ Error:", error);
    } else {
      console.log("✔ Email sent:", info.response);
    }
  });
};
