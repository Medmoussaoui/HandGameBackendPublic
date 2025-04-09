import mongoose from "mongoose";

// const MONGODB_URI =
//   "mongodb+srv://rooot:moussaouimohamedtooop@cluster0.6ht6l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const MONGODB_URI = "mongodb://localhost:27017/handgame";

export const initialMongoDBConnection = () => {
  // MongoDB connection
  mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err: Error) => console.error("MongoDB connection error:", err));
};
