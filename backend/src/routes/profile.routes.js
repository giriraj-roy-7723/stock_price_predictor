const express = require("express");
const User = require("./models/User");
const router = express.Router();
const { authRequired } = require("../middleware/auth");

// GET /api/users/profile - Get user profile
router.get("/profile", authRequired, async (req, res) => {
  try {
    const profile = await User.findById(req.user.id).select("-password").lean();
    if (!profile) return res.status(404).json({ error: "Profile not found" });

    return res.json(profile);
  } catch (error) {
    rext(error);
  }
});

// PATCH /api/users/update - Update user profile
router.patch("/update", authRequired, async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password || updates.role) {
      return res
        .status(400)
        .json({ error: "Cannot update password or role via this endpoint" });
    }
    const allowed = ["firstName", "lastName", "email"];
    Object.keys(updates).forEach((key) => {
      if (!allowed.includes(key)) {
        delete updates[key];
      }
    });
    const updatedProfile = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { ...updates } },
      { new: true, upsert: false, runValidators: true },
    ).lean();
    if (!updatedProfile)
      return res.status(404).json({ error: "Profile not found" });

    return res.json(updatedProfile);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
