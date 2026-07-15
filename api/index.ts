import app from "../src/app";
import { connectDB } from "../src/config/mongodb";
import serverless from "serverless-http";

let isConnected = false;

const handler = serverless(app);

export default async (req: any, res: any) => {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
      console.log("✅ MongoDB Connected");
    }

    return handler(req, res);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};