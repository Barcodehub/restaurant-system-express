 
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER!,
    to: email,
    subject: 'Verify your email',
    text: `Click the link to verify your email: http://yourapp.com/verify?token=${token}`,
  };

  await transporter.sendMail(mailOptions);
};