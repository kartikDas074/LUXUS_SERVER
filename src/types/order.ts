export interface IOrder {
  userId: string;
  userEmail: string;
  userName: string;

  sellerId: string;

  productId: string;
  productName: string;
  sku: string;
  category: string;
  brand: string;

  featuredImage: string;

  selectedColor: string;

  quantity: number;

  deliveryRegion: string;
  estimatedDelivery: string;

  unitPrice: number;
  subtotal: number;
  shippingCharge: number;
  grandTotal: number;

  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
}