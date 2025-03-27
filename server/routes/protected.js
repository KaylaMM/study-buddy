import express from "express";
import jwtAuth from "../middleware/jwtAuth.js";

const router = express.Router();

router.get("/profile", jwtAuth, async (req, res) => {
  try {
    res.json({
      message: "Protected route accessed successfully",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: "Error accessing protected route" });
  }
});

export default router;
