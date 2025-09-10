export const resetPasswordEmail = ({ name, token, link }) => {
  // ensure safe string values
  name = name ?? "";
  token = token ?? "";
  link = link ?? "#";

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Password</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f7;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      .header {
        background: #dc3545;
        color: #ffffff;
        padding: 20px;
        text-align: center;
      }
      .content {
        padding: 20px;
        color: #333333;
        line-height: 1.6;
      }
      .token {
        font-size: 1.5em;
        font-weight: bold;
        color: #dc3545;
        margin: 10px 0;
        text-align: center;
      }
      .button {
        display: inline-block;
        margin: 20px 0;
        padding: 12px 20px;
        background: #28a745;
        color: #ffffff !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
      }
      .footer {
        text-align: center;
        padding: 15px;
        font-size: 12px;
        color: #777777;
        background: #f9f9f9;
      }
    </style>
  </head>
  <body>
  <div class="container">
      <div class="header">
        <h1>Password Reset Request</h1>
      </div>
      <div class="content">
        <p>Hi <strong>${name}</strong>,</p>
        <p>You requested to reset your password. Use the token below and click the button to proceed:</p>
        <div class="token">${token}</div>
        <p style="text-align:center;">
          <a href="${link}" class="button">Reset Password</a>
        </p>
        <p>If you did not request this, you can safely ignore this email.</p>
        <p>Cheers,<br>The Ecommerce Team</p>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Ecommerce Platform. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};
