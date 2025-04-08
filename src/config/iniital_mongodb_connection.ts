import mongoose from "mongoose";

const MONGODB_URI = "mongodb://localhost:27017/handgame";

export const initialMongoDBConnection = () => {
  // MongoDB connection
  mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err: Error) => console.error("MongoDB connection error:", err));
};
