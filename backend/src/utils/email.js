const nodemailer = require('nodemailer');
const env = require('../config/env');

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT || 587;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

if (host && user && pass) {
  const testTransporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass },
  });
  testTransporter.verify((error) => {
    if (error) {
      console.error('SMTP Production Validation Failure on boot:', error.message);
    } else {
      console.log('SMTP production server connection verified successfully.');
    }
  });
}

// Support optional SMTP credentials, fallback to console logger in development
const getTransporter = async () => {

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: { user, pass },
    });
  }

  // Fallback: in development, try to create an Ethereal test account if internet is available,
  // otherwise use a dry-run console logger.
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch {
    // True dry-run console transporter
    return {
      sendMail: async (mailOptions) => {
        console.log('--- DRY RUN EMAIL START ---');
        console.log(`To: ${mailOptions.to}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`Body:\n${mailOptions.text || mailOptions.html}`);
        console.log('--- DRY RUN EMAIL END ---');
        return { messageId: 'dry-run-id' };
      },
    };
  }
};

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = await getTransporter();
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"SurCodex Assessments" <noreply@surcodex.com>',
      to,
      subject,
      text,
      html,
    });

    if (info.messageId !== 'dry-run-id' && info.host === 'smtp.ethereal.email') {
      console.log(`Development verification/reset email preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return info;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

const sendVerificationEmail = async (email, name, token) => {
  const verificationLink = `${env.CORS_ORIGIN || 'http://localhost:5173'}/verify-email?token=${token}`;
  const subject = 'Verify your SurCodex account';
  const text = `Hi ${name},\n\nPlease verify your account by clicking the link: ${verificationLink}\n\nThis link expires in 24 hours.`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0ea5e9;">Welcome to SurCodex!</h2>
      <p>Hi ${name},</p>
      <p>Thank you for registering. Please click the button below to verify your email address and activate your account:</p>
      <div style="margin: 24px 0;">
        <a href="${verificationLink}" style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Verify Email Address</a>
      </div>
      <p style="font-size: 12px; color: #64748b;">If the button above does not work, copy and paste this URL into your browser:</p>
      <p style="font-size: 12px; color: #0ea5e9; word-break: break-all;">${verificationLink}</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #94a3b8;">This verification link will expire in 24 hours.</p>
    </div>
  `;

  return sendEmail({ to: email, subject, text, html });
};

const sendPasswordResetEmail = async (email, name, token) => {
  const resetLink = `${env.CORS_ORIGIN || 'http://localhost:5173'}/reset-password?token=${token}`;
  const subject = 'Reset your SurCodex password';
  const text = `Hi ${name},\n\nYou requested a password reset. Please click the link to reset your password: ${resetLink}\n\nThis link expires in 1 hour. If you did not request this, please ignore this email.`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #ef4444;">Reset Password Request</h2>
      <p>Hi ${name},</p>
      <p>We received a request to reset your password. Click the button below to configure a new password:</p>
      <div style="margin: 24px 0;">
        <a href="${resetLink}" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p style="font-size: 12px; color: #64748b;">If the button above does not work, copy and paste this URL into your browser:</p>
      <p style="font-size: 12px; color: #ef4444; word-break: break-all;">${resetLink}</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; color: #94a3b8;">This reset link will expire in 1 hour. If you did not make this request, you can safely ignore this email.</p>
    </div>
  `;

  return sendEmail({ to: email, subject, text, html });
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
