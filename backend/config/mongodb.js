import mongoose from "mongoose";
const connectDB = async () => {
  try {
    // Validate the environment variable
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in the environment variables");
    }

    // Connect to the database and specify the database name
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "prescripta", // Specify the database explicitly
    });

    console.log("Database connected successfully");

    // Optional: Add additional listeners
    mongoose.connection.on("disconnected", () => {
      console.warn("Database disconnected");
    });

    mongoose.connection.on("error", (error) => {
      console.error("Database connection error:", error);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error.message);

    // Exit the process if the database connection fails
    process.exit(1);
  }
};

export default connectDB;
