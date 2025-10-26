import { user as users, products, categories, productVariants, variantAttributes, productRelations, coupons, profile  } from "@/db/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { Type } from "lucide-react";

/*  User Types */

export type User = InferSelectModel<typeof users>;

export type NewUser = InferInsertModel<typeof users>;

// Profile Types

export type Profile = InferSelectModel<typeof profile>;

export type NewProfile = InferInsertModel<typeof profile>;

export type ProfileWithUser = Profile & {
  user: User;
};

// Product Types with Varients and Attributes

export type Product = InferSelectModel<typeof products> & {
  variants: (InferSelectModel<typeof productVariants> & {
    attributes: InferSelectModel<typeof variantAttributes>[];
  })[];
  category: InferSelectModel<typeof categories>;
};


export type NewVariantAttribute = Omit<InferInsertModel<typeof variantAttributes>, "variantId"> & {
  variantId?: string;
};

export type NewProductVariant = Omit<InferInsertModel<typeof productVariants>, "productId"> & {
  productId?: string;
  attributes?: NewVariantAttribute[];
};

export type NewProduct = Omit<InferInsertModel<typeof products>, "categoryId"> & {
  categoryId: string;
  variants?: NewProductVariant[];
};




// Category Types

export type Category = InferSelectModel<typeof categories>;

export type NewCategory = InferInsertModel<typeof categories>;


// Coupon Types

export type Coupon = InferSelectModel<typeof coupons>;

export type NewCoupon = InferInsertModel<typeof coupons>;


// Cart Types

export interface CartItem {
  productId: string;
  sellPrice: number;
  quantity: number;
}




// Session Types
export type Role = "admin" | "user" | "moderator";


export type SessionUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: Role; // required
  banned: boolean | null;
  banReason?: string | null;
  banExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Session = {
  session: {
    id: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    ipAddress?: string | null;
    userAgent?: string;
    userId: string;
    impersonatedBy?: string | null;
    activeOrganizationId?: string | null;
  };
  user: SessionUser;
};

