import { pgTable, text, uuid, timestamp, boolean, integer, numeric, jsonb, json, pgEnum } from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm";

export const roles = pgEnum("roles", ["admin", "user", "moderator"])

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  // role: text("role").notNull().default("user"),
  role:roles().default("user"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
  activeOrganizationId: text("active_organization_id"),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const organization = pgTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  logo: text("logo"),
  createdAt: timestamp("created_at").notNull(),
  metadata: text("metadata"),
});

export const member = pgTable("member", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: text("role").default("member").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const invitation = pgTable("invitation", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role"),
  status: text("status").default("pending").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  inviterId: text("inviter_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

  // Product Schema

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(), // product name
  slug: text("slug").notNull().unique(), // SEO-friendly unique slug
  description: text("description"), // long text (rich editor content)

  isActive: boolean("is_active").default(true).notNull(), // active/inactive

  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }), // <-- relationship

  tags: text("tags").array(), // product tags (for search, filters)

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const productVariants = pgTable("product_variants", {
  id: uuid("id").primaryKey().defaultRandom(),

  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),


  sellPrice: integer("list_price").notNull(),
  costPrice: integer("cost_price").notNull(),
  stock: integer("stock").default(0).notNull(),
  images: jsonb("images").$type<string[]>().default(sql`'[]'::jsonb`).notNull(),

  isActive: boolean("is_active").default(true).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});


export const variantAttributes = pgTable("variant_attributes", {
  id: uuid("id").primaryKey().defaultRandom(),

  variantId: uuid("variant_id")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),

  name: text("name").notNull(),  // e.g. "color", "size", "weight"
  value: text("value").notNull(), // e.g. "red", "XL", "2kg"
});


  // Category Schema
export const categories = pgTable("categories", {
    id: uuid("id").primaryKey().defaultRandom(), // UUID v7 if supported
    name: text("name").notNull(),
    slug: text("slug").notNull(), // URL-friendly
    description: text("description"),
    image: jsonb("image").$type<{ url: string; fileId: string } | null>(), // ✅ type defined

    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  
);

// Coupons Schema
export const discount = pgEnum("discount_type", ["percent", "flat"])

export const coupons = pgTable("coupons", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull().unique(),         // e.g. "WELCOME10"
  discountType: discount().notNull(), // "percent" | "flat"
  discountValue: integer("discount_value").notNull(), // 10 means 10% or ₹10
  isActive: boolean("is_active").default(true).notNull(),
  expiry: timestamp("expiry").notNull(),
  usageLimit: integer("usage_limit").default(1).notNull(), // how many times total it can be used
  usedCount: integer("used_count").default(0).notNull(),   // how many times it has been used so far
  createdAt: timestamp("created_at").defaultNow(),
});



// Cart Schema

export const cart = pgTable("cart", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull().references(() => user.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const cartItems = pgTable("cart_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  cartId: uuid("cart_id")
    .notNull()
    .references(() => cart.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").default(1).notNull(),
  price: integer("price").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// RELATIONS

export const categoryRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));


export const productRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
}));



export const variantRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }), // variant → product
  attributes: many(variantAttributes), // variant → attributes
}));

export const attributeRelations = relations(variantAttributes, ({ one }) => ({
  variant: one(productVariants, {
    fields: [variantAttributes.variantId],
    references: [productVariants.id],
  }), // attribute → variant
}));

// ✅ Relation between user and cart
export const cartRelations = relations(cart, ({ one, many }) => ({
  user: one(user, {
    fields: [cart.userId],
    references: [user.id],
  }),
  cartItems: many(cartItems),
}));

// ✅ Relation between cart and cartItems
export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(cart, {
    fields: [cartItems.cartId],
    references: [cart.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));



export const schema = {
  user,
  session,
  account,
  verification,
  organization,
  member,
  invitation,
  products,
  productVariants,
  variantAttributes,
  categories,
  cart,
  cartItems,
  coupons,
  discount,
  categoryRelations,
  productRelations,
  variantRelations,
  attributeRelations,
  cartRelations,
  cartItemsRelations,
};
