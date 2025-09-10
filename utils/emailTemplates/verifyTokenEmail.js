

export const verifyTokenEmail = ({ name, token }) => {
  return `
    <div style="font-family: Arial, sans-serif;">
      <h2>Welcome to Our Ecommerce Platform, ${name}!</h2>
      <p>Thank you for registering. Please verify your email address to activate your account.</p>
      <p>Your verification token is:</p>
      <div style="font-size: 1.5em; font-weight: bold; color: #007bff; margin: 10px 0;">${token}</div>
      <p>Enter this token in the website to verify your account.</p>
      <p style="font-size: 1.5em; color: #FF0000;">This verification token will expire in 10 minutes.</p>
      <p>If you did not create this account, you can safely ignore this email.</p>
      <br>
      <p>Best regards,<br>The Ecommerce Team</p>
    </div>
  `;
};
