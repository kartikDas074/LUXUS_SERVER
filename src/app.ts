import express, { Request, Response } from "express";
import cors from "cors";
import client from "./config/mongodb";
import { ICompany } from "./types/company";
import { Filter } from "mongodb";
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database
const db = client.db("LUXE");
const companyCollection = db.collection<ICompany>("company");

// Routes
app.get("/", (_, res) => {
  res.send("Luxus Server Running...");
});

app.post("/registerCompany", async (req: Request, res: Response) => {
  try {
    const data = req.body as ICompany;

    const result = await companyCollection.insertOne(data);

    res.status(201).json({
      success: true,
      message: "Company Registered Successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

interface CompanyQuery {
  userId?: string;
}

app.get(
  "/company",
  async (req: Request<{}, {}, {}, CompanyQuery>, res: Response) => {
    try {
      const query: Filter<ICompany> = {};

      if (req.query.userId) {
        query.userId = req.query.userId;
        
      }
     
      const result = await companyCollection.find(query).toArray();
      
      res.status(200).json({
        success: true,
        message: "Company fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error fetching company:", error);

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
);

export default app;
