import User from "../models/users.modal.js";
import sendEmail from "../utils/sendEmail.js";
import { resetPasswordEmail } from "../utils/emailTemplates/resetPasswordEmail.js";

// Shared password reset functions usable by auth and admin flows
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required", success: false });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }
    // generate 6-digit reset token
    const resetPasswordToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    // Send reset token to user's email
    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      html: resetPasswordEmail({
        name: user.name,
        token: user.resetPasswordToken,
        link: `${process.env.FRONTEND_URL}/reset-password`,
      }),
    });

    res
      .status(200)
      .json({ message: "Password reset token sent to email", success: true });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { resetPasswordToken, newPassword } = req.body;
    if (!resetPasswordToken || !newPassword) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired token", success: false });
    }
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res
      .status(200)
      .json({ message: "Password reset successful", success: true });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
