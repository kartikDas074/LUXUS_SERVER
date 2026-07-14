export interface IProduct {
  sellerId: string;

  productName: string;
  shortDescription: string;
  fullDescription: string;

  category: string;
  brand: string;

  regularPrice: number;
  discountPrice: number | "";

  stock: number;
  sku: string;

  images: string[];

  shippingCharge: number;
  estimatedDelivery: string;

  specifications: {
    key: string;
    value: string;
  }[];

  warranty: string;

  variants: string[];

  tags: string[];

  status: "active" | "draft" | "out_of_stock";

  visibility: "public" | "private" | "hidden";

  createdAt: string;
  updatedAt: string;
}