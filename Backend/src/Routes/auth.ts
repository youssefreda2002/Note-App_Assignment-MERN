import express from "express";
import { User } from "../Model Schema/User";
import crypto from "crypto";
import { sendOtpEmail } from "../utils/Mailer";
import jwt from "jsonwebtoken";
import passport from "passport";

const router = express.Router();

// Request OTP
router.post("/request-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  const user = await User.findOneAndUpdate(
    { email },
    { $set: { otp, otpExpires } },
    { upsert: true, new: true }
  );
  // send email
  try {
    await sendOtpEmail(email, otp);
    return res.json({ message: "OTP sent" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
});

// Verify OTP -> return JWT
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ message: "email & otp required" });
  const user = await User.findOne({ email });
  if (!user || !user.otp)
    return res.status(400).json({ message: "OTP not requested" });
  if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
  if (!user.otpExpires || user.otpExpires < new Date())
    return res.status(400).json({ message: "OTP expired" });

  // success -> clear otp, issue JWT, create if needed already made by upsert
  user.otp = null;
  user.otpExpires = null;
  await user.save();

  const token = jwt.sign(
    { sub: user._id },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "7d" }
  );
  res.json({ token, user: { email: user.email, name: user.name } });
});

// get me
router.get("/me", async (req, res) => {
  // token handled by middleware in other routes; we replicate a simple check here
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "Missing token" });
  try {
    const token = auth.split(" ")[1];
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as any;
    const user = await User.findById(payload.sub).lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user: { email: user.email, name: user.name } });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.get("/google", (req, res, next) => {
  const redirectTo =
    (req.query.redirect as string) ||
    (process.env.FRONTEND_ROOT
      ? process.env.FRONTEND_ROOT + "/oauth-redirect"
      : "http://localhost:5173/oauth-redirect");
  // pass the desired frontend redirect in state (encoded)
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: encodeURIComponent(redirectTo),
  })(req, res, next);
});

// Google callback
router.get("/google/callback", (req, res, next) => {
  // Use custom callback so we can issue JWT and redirect with token
  passport.authenticate("google", { session: false }, (err: any, user: any) => {
    if (err || !user) {
      console.error("Google auth error:", err);
      const failRedirect =
        (process.env.FRONTEND_ROOT || "http://localhost:5173") +
        "/auth?error=google_failed";
      return res.redirect(failRedirect);
    }

    // Create JWT
    const token = jwt.sign(
      { sub: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    // Get redirect from state (if any). default to FRONTEND_ROOT/oauth-redirect
    const state = req.query.state
      ? decodeURIComponent(req.query.state as string)
      : process.env.FRONTEND_ROOT
      ? process.env.FRONTEND_ROOT + "/oauth-redirect"
      : "http://localhost:5173/oauth-redirect";

    // Append token in query; handle existing query params
    const redirectUrl = `${state}${
      state.includes("?") ? "&" : "?"
    }token=${token}`;

    console.log("Google OAuth redirect ->", redirectUrl);
    return res.redirect(redirectUrl);
  })(req, res, next);
});

export default router;
