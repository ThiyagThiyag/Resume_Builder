import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const message = {
    from: `Resumify <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
          }
          .header {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            font-size: 28px;
            margin: 0;
            font-weight: 700;
            letter-spacing: -0.5px;
          }
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          .content h2 {
            color: #1e293b;
            font-size: 24px;
            margin-top: 0;
            margin-bottom: 16px;
          }
          .content p {
            color: #64748b;
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 30px;
          }
          .otp-container {
            background-color: #f1f5f9;
            border-radius: 12px;
            padding: 20px;
            margin: 0 auto;
            max-width: 300px;
            letter-spacing: 4px;
          }
          .otp-code {
            color: #4f46e5;
            font-size: 36px;
            font-weight: 800;
            margin: 0;
          }
          .footer {
            background-color: #f8fafc;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
          }
          .footer p {
            color: #94a3b8;
            font-size: 14px;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Resumify</h1>
          </div>
          <div class="content">
            <h2>Verify Your Email</h2>
            <p>Welcome to Resumify! To ensure the security of your account, please enter the 6-digit verification code below to complete your authentication.</p>
            <div class="otp-container">
              <p class="otp-code">${options.otp}</p>
            </div>
            <p style="margin-top: 30px; font-size: 14px;">This code will expire in 10 minutes.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Resumify. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  const info = await transporter.sendMail(message);
  console.log('Message sent: %s', info.messageId);
};

export default sendEmail;
