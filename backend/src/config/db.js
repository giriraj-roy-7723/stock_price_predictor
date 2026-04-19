const mongoose = require("mongoose");

const MAX_RETRIES = 5;
const RETRY_DELAY = 1000; // 1 seconds

const connectDB = async () => {
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("MongoDB connected");
      return;
    } catch (error) {
      attempt++;
      console.error(`MongoDB connection failed on attempt ${attempt}`);

      if (attempt >= MAX_RETRIES) {
        console.error("Max retries reached. Exiting...");
        process.exit(1);
      }

      console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);

      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
};


module.exports =  connectDB;
