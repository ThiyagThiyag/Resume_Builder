import nodemailer from 'nodemailer';

const sendSuccessEmail = async (options) => {
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
            background-color: #f0fdf4;
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
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
            border: 1px solid #dcfce3;
          }
          .header {
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            padding: 40px 30px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            font-size: 32px;
            margin: 0;
            font-weight: 800;
            letter-spacing: -0.5px;
          }
          .header p {
            color: #dcfce3;
            font-size: 16px;
            margin-top: 10px;
            margin-bottom: 0;
          }
          .content {
            padding: 40px 30px;
            text-align: center;
          }
          .icon-container {
            width: 80px;
            height: 80px;
            background-color: #dcfce3;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px auto;
          }
          .icon-container svg {
            color: #16a34a;
            width: 40px;
            height: 40px;
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
            line-height: 1.6;
            margin-bottom: 30px;
          }
          .btn {
            display: inline-block;
            background-color: #22c55e;
            color: #ffffff;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 50px;
            font-weight: 700;
            font-size: 16px;
            box-shadow: 0 4px 14px rgba(34, 197, 94, 0.4);
          }
          .footer {
            background-color: #f8fafc;
            padding: 24px;
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
            <h1>Welcome to Resumify! 🎉</h1>
            <p>Your journey to a perfect resume starts here.</p>
          </div>
          <div class="content">
            <div class="icon-container">
              <!-- Custom Checkmark SVG -->
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2>Registration Successful</h2>
            <p>Hi <strong>${options.name}</strong>,<br><br>Your email has been successfully verified and your account is now fully active. We are absolutely thrilled to have you on board!</p>
            <p>You can now start building professional, eye-catching resumes in minutes using our premium templates.</p>
            <a href="http://localhost:5173/builder" class="btn">Start Building Now</a>
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
  console.log('Success Email sent: %s', info.messageId);
};

export default sendSuccessEmail;
