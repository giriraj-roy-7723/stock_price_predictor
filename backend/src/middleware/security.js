const helmet = require("helmet");
const cors = require("cors");

// helmet protect against attacks like:
//    Attack	          Protection
// Clickjacking	    X-Frame-Options
// MIME sniffing	  X-Content-Type-Options
// XSS injection	  Content-Security-Policy
// HTTPS downgrade	Strict-Transport-Security
module.exports = [
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Only load resources from your domain
        styleSrc: ["'self'", "'unsafe-inline'"], // Only allow scripts from your server
        scriptSrc: ["'self'"], // Images allowed from https and base64
        imgSrc: ["'self'", "data:", "https:"], // Allows inline styles
      },
    },
  }),
  // cors() protects your API from unauthorized websites calling it from browsers.
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true, // Allows sending: cookies, authorization headers, sessions    
  }),
];
