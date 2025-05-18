import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://ammychaudhary110:pDq0B2UbzederdjN@cluster0.szyasxo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Optional: kill server if DB fails
   
  }
};

export default connectDB;
// pDq0B2UbzederdjN   ammychaudhary110