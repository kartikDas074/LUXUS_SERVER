export interface ICompany {
  userID: string;

  ownerName: string;

  businessEmail: string;

  businessPhone: string;

  businessAddress: string;

  city: string;

  stateProvince: string;

  country: string;

  postalCode: string;

  shopName: string;

  shopCategory: string;

  shopDescription: string;

  shopLogo: string;

  shopBanner: string;

  preferredCurrency: string;

  preferredLanguage: string;

  agreeToTerms: boolean;

  agreeToStripe: boolean;

  agreeToCommission: boolean;

  status: "pending" | "approved" | "rejected";
}