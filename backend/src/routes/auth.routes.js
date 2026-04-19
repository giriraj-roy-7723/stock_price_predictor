const express = require("express");
const router = express.Router();
const ms = require("ms");
const User = require("./models/User");
const { signAccessToken, signRefreshToken } = require("../utils/jwt");
const { refresh, authRequired } = require("../middleware/auth");

const REFRESH_TIME_MS = ms(process.env.JWT_REFRESH_EXPIRES || "7d");

// POST /api/auth/signup - User signup
router.post("/signup", async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role, adminSecret } =
      req.body;

    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (role === "admin" && !adminSecret) {
      return res
        .status(400)
        .json({ error: "Missing admin secret for admin role" });
    }

    const exists = await User.findOne({ email }).exec();
    if (exists) {
      return res.status(409).json({ error: "Email already registered" });
    }

    let assignedRole = "user";

    if (role === "admin") {
      if (adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ error: "Invalid admin secret" });
      }
      assignedRole = "admin";
    }
    const user = new User({
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      role: assignedRole,
    });

    await user.save();

    const accessToken = signAccessToken({ id: user._id, role: assignedRole });
    const refreshToken = signRefreshToken({ id: user._id, role: assignedRole });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // browser stores the cookie only not stored in localstorage
      secure: process.env.NODE_ENV === "production",
      // Browser sends the cookie only when the request uses HTTPS.
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
      // browser sends the cookie only to the websites whose request originated it
      // browser is the middleman between the frontend and backend
      path: "/api/auth",
      maxAge: REFRESH_TIME_MS, // 7 days
    });

    return res.json({
      message: "Signup successful",
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: assignedRole,
        },
        tokens: { accessToken },
      },
    });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(409).json({ error: "Email already registered" });
    }
    next(error);
  }
});

// POST /api/auth/login - User login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const okPw = await user.comparePassword(password);
    if (!okPw) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = signAccessToken({ id: user._id, role: user.role });
    const refreshToken = signRefreshToken({ id: user._id, role: user.role });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
      path: "/api/auth",
      maxAge: REFRESH_TIME_MS, // 7 days
    });

    return res.json({
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        tokens: { accessToken },
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// POST /api/auth/refresh - Refresh access token
router.post("/refresh", refresh);

// POST /api/auth/logout
router.post("/logout", async (req, res, next) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
      path: "/api/auth",
    });

    return res.json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
router.get("/me", authRequired, async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
