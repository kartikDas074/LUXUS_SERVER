import app from "../src/app";
import { connectDB } from "../src/config/mongodb";

let isConnected = false;

export default async (req: any, res: any) => {
  try {
  
    if (!isConnected) {
      //await connectDB();
      isConnected = true;
      console.log("✅ MongoDB Connected");
    }

    
    return app(req, res);
  } catch (error) {
    console.error("🚨 Serverless Handler Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};