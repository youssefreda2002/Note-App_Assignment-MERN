import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../Model Schema/User";

export interface AuthRequest extends Request {
  user?: any;
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const auth = req.headers.authorization;
  if (!auth)
    return res.status(401).json({ message: "Missing Authorization header" });
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as any;
    const user = await User.findById(payload.sub).lean();
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
