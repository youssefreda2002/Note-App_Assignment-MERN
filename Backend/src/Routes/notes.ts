import express from "express";
import { authMiddleware, AuthRequest } from "../Middleware/auth";
import { Note } from "../Model Schema/Note";

const router = express.Router();

router.use(authMiddleware);

router.get("/", async (req: AuthRequest, res) => {
  const notes = await Note.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .lean();
  res.json({ notes });
});

router.post("/", async (req: AuthRequest, res) => {
  const { title, content } = req.body;
  if (!title && !content)
    return res.status(400).json({ message: "Title or content required" });
  const note = await Note.create({ user: req.user._id, title, content });
  res.json({ note });
});

router.delete("/:id", async (req: AuthRequest, res) => {
  const id = req.params.id;
  const note = await Note.findById(id);
  if (!note) return res.status(404).json({ message: "Note not found" });
  if (note.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not allowed" });
  await note.deleteOne();
  res.json({ message: "Deleted" });
});

export default router;
