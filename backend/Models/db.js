const mongoose = require("mongoose");

const mongoURL = process.env.MONGO_URI || process.env.MONGO_CONN;
if (!mongoURL) {
  console.error("❌ MongoDB connection URI is not configured (MONGO_URI/MONGO_CONN)");
  process.exit(1);
}

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
};

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL, options);
    console.log("✅ MongoDB Connected...");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.log("Retrying MongoDB connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

connectDB();

mongoose.connection.on("connected", () => {
  console.log("✅ Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ Mongoose disconnected. Retrying...");
  connectDB();
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🛑 Mongoose connection closed on app termination");
  process.exit(0);
});

module.exports = mongoose;
