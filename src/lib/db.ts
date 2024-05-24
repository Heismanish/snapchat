import mongoose, { Connection } from "mongoose";

// here we have done this optimisation to check if we already have a cached connection
let cachedConnection: Connection | null = null;

export async function connectToMongoDB() {
  if (cachedConnection) {
    console.log("Using cached MONGODB connection");
    return cachedConnection;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    cachedConnection = conn.connection;
    console.log("DB CONNECTED");
    return cachedConnection;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
