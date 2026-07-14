import express, { Request, Response } from "express";
import cors from "cors";
import client from "./config/mongodb";
import { ICompany } from "./types/company";
import { Filter, ObjectId } from "mongodb";
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database
const db = client.db("LUXE");
const companyCollection = db.collection<ICompany>("company");
const userCollection=db.collection('user')
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
      console.log(query);
     
      const result = await companyCollection.find(query).toArray();
      console.log(result);
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

app.patch("/company/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id ;
    const data = req.body as Partial<ICompany>;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Company ID",
      });
    }

    const filter: Filter<ICompany> = {
      _id: new ObjectId(id),
    };

    const result = await companyCollection.updateOne(filter, {
      $set: data,
    });

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Company Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Company Updated Successfully",
      data: result,
    });
  } catch (error) {
    console.error("Update Company Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.patch("/userRole/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id  as string;;
    const data = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID",
      });
    }

    const result = await userCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: data,
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User Role Updated Successfully",
      data: result,
    });
  } catch (error) {
    console.error("User Role Update Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

export default app;
