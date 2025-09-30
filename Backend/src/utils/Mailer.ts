// utils/mailer.ts
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendOtpEmail(to: string, otp: string) {
  const msg = {
    to,
    from: process.env.SMTP_FROM!, // must match a verified sender in SendGrid
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}`,
    html: `<p>Your OTP is <b>${otp}</b></p>`,
  };

  try {
    const response = await sgMail.send(msg);
    console.log("OTP email sent:", response[0].statusCode);
  } catch (error: any) {
    console.error("SendGrid error:", error.response?.body || error);
    throw new Error("Failed to send OTP email");
  }
}
