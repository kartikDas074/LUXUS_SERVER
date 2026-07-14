import express, { Request, Response } from "express";
import cors from "cors";
import client from "./config/mongodb";
import { ICompany } from "./types/company";
import { Filter, ObjectId } from "mongodb";
import { IProduct } from "./types/product";
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database
const db = client.db("LUXE");
const companyCollection = db.collection<ICompany>("company");
const userCollection=db.collection('user');
const productCollection=db.collection<IProduct>('product');
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
    const id = req.params.id as string ;
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

app.post("/product", async (req: Request, res: Response) => {
  try {
    const data = req.body as IProduct;
    console.log(data);
    const result = await productCollection.insertOne(data);
    console.log(result);
    return res.status(201).json({
      success: true,
      message: "Product Added Successfully",
      data: result,
    });
  } catch (error) {
    console.error("Product Add Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

interface ProductQuery {
  id?: string;
  category?: string;
  brand?: string;
  status?: IProduct["status"];
  visibility?: IProduct["visibility"];
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
  limit?: string;
}

app.get(
  "/product",
  async (req: Request<{}, {}, {}, ProductQuery>, res: Response) => {
    try {
      const query: Filter<IProduct> = {};

    
      if (req.query.id) {
        query.sellerId = req.query.id;
      }

     
      if (req.query.category) {
        query.category = req.query.category;
      }

      
      if (req.query.brand) {
        query.brand = req.query.brand;
      }

     
      if (req.query.status) {
        query.status = req.query.status;
      }

      
      if (req.query.visibility) {
        query.visibility = req.query.visibility;
      }

     
      if (req.query.search) {
        query.productName = {
          $regex: req.query.search,
          $options: "i",
        };
      }

      
      if (req.query.minPrice || req.query.maxPrice) {
        query.regularPrice = {};

        if (req.query.minPrice) {
          query.regularPrice.$gte = Number(req.query.minPrice);
        }

        if (req.query.maxPrice) {
          query.regularPrice.$lte = Number(req.query.maxPrice);
        }
      }

      
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const skip = (page - 1) * limit;

      const totalProducts = await productCollection.countDocuments(query);

      const products = await productCollection
        .find(query)
        .skip(skip)
        .limit(limit)
        .toArray();

      return res.status(200).json({
        success: true,
        message: "Products fetched successfully",

        pagination: {
          currentPage: page,
          limit,
          totalProducts,
          totalPages: Math.ceil(totalProducts / limit),
        },

        data: products,
      });
    } catch (error) {
      console.error("Fetch Products Error:", error);

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

export default app;
