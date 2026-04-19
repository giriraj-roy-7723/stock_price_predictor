const mongoose = require("mongoose");

const gracefulShutdown = async (server,signal) => {
  process.on(signal, async () => {
    console.log("Shutting down...");

    server.close(() => {
      mongoose.connection.close(false, () => {
        console.log("Mongo connection closed.");
        process.exit(0);
      });
    });
  });
};

module.exports = gracefulShutdown;
