import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import MongoDB from "./DB/DB";
import passport from "passport";
import authRoutes from "./Routes/auth";
import notesRoutes from "./Routes/notes";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "./Model Schema/User";

const App = express();
const PORT = process.env.PORT || 7000;
App.use(cors({ origin: true, credentials: true }));
App.use(express.json());
App.use(cookieParser());
App.get("/", (req, res) => {
  res.send("API Working correctly");
});

MongoDB();
App.use("/api/auth", authRoutes);
App.use("/api/notes", notesRoutes);
App.use("/auth", authRoutes);

App.use(passport.initialize());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: `${
        process.env.BACKEND_ROOT || "http://localhost:7000"
      }/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        let user = await User.findOne({ googleId: profile.id });
        if (!user && email) user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            googleId: profile.id,
          });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }

        done(null, user);
      } catch (err) {
        console.error("Google strategy error:", err);
        done(err);
      }
    }
  )
);

App.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
