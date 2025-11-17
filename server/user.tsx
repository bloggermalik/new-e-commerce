"use server"
import { db } from "@/db/drizzle";
import { auth } from "@/lib/auth";
import { asc, desc, eq, is, sql } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { user as users, categories, products, productVariants, variantAttributes, coupons, cart, cartItems, profile, orders, orderItems, comments } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Category, Coupon, NewCategory, NewCoupon, NewProduct, NewUser, OnlyProduct, Product, ProfileWithUser, Role, Session, User, UserWithProfile } from "@/types/type";
import { can } from "@/lib/auth/check-permission";
import { uuidv4 } from "zod";


export const signIn = async (values: { email: string, password: string }) => {
  try {
    await auth.api.signInEmail({
      body: {
        email: values.email,
        password: values.password,
      }
    });
    return {
      message: "Sign-in successful",
      success: true,
    }
  } catch (error) {
    console.error("Error signing in:", error);
    return {
      message: "Sign-in failed",
      success: false,
    }
  }
}

export const signUp = async (values: { name: string, email: string, password: string }) => {
  await auth.api.signUpEmail({
    body: {
      name: values.name,
      email: values.email,
      password: values.password,
    }
  });
}


export const getSession = async (): Promise<Session | undefined> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) return undefined;

    return {
      ...session,
      session: {
        ...session.session,
        ipAddress: session.session.ipAddress ?? null,
        userAgent: session.session.userAgent ?? undefined,
      },
      user: {
        ...session.user,
        role: session.user.role as Role,
        banned: session.user.banned ?? null,

      },
    };
  } catch (error) {
    console.error("Error getting session:", error);
    return undefined;
  }
};


export const getCurrentUser = async () => {
  const session = await getSession();
  if (!session) redirect("/login");

  const currentUser = await db.query.user.findFirst({
    where: eq(users.id, session.user.id)
  });

  console.log("currentUser", currentUser);


  return {
    ...session,
    user: currentUser
  }
}


export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });

  (await cookies()).delete("better-auth.session");
}



// USER CRUD


export async function isAdmin() {

  const session = await getSession();
  const admin = session?.user?.role == "admin";

  if (!session) {
    redirect("/login");
  }


  if (!admin) {
    redirect("/login");
  }
  return admin;

}

export async function getUserById(id: string): Promise<User | null> {
  const session = await getSession()
  if (!session) return null

  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1).orderBy(desc(users.createdAt))

  // Drizzle returns an array, so take first item
  return result.length > 0 ? result[0] : null
}

export async function getUser() {

  const session = await getSession();
  if (!session) redirect("/login");

  const user = await db.select().from(users).orderBy(desc(users.createdAt));

  console.log("User from getUser function:", user);
  return user;


}


export async function deleteUser(id: string): Promise<{ success: boolean, message: string }> {
  const session = await getSession();
  if (!session) redirect("/login");

  const hasPermission = await can(session, { users: ["delete"] });
  if (!hasPermission) return { success: false, message: "You do not have permission to delete users." }
  try {
    await db.execute(sql`DELETE FROM "user" WHERE id = ${id}`);
    return { success: true, message: "User deleted successfully." }

  } catch (error) {
    return {
      success: false,
      message:
        "Error deleting user: " +
        (error instanceof Error ? error.message : "Unknown error"),
    };
  }


}


export async function createUser(values: { name: string, email: string, password: string, role?: "admin" | "user" | "moderator" }) {
  const session = await getSession();

  // 1. Session Check
  if (!session) {
    return redirect("/login");
  }

  // 2. Permission Check
  const hasPermission = await can(session, { users: ["create"] });
  if (!hasPermission) return { success: false, message: "You do not have permission to create users." }

  // 3. User Creation Attempt
  try {
    await auth.api.createUser({
      body: {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      },
      headers: await headers(),
    });
    return { success: true, message: "User created successfully." };


  } catch (error) {

    return { success: false, message: "Error creating user: " + (error instanceof Error ? error.message : "Unknown error") };
  }
}

export async function updateUser(id: string, values: Partial<NewUser>) {
  const session = await getSession();
  if (!session) return;

  const has = await can(session, { users: ["update"] });
  if (!has)
    return { success: false, message: "You do not have permission to update users." };

  try {
    await auth.api.adminUpdateUser({
      body: {
        userId: id,
        data: {
          name: values.name,
          email: values.email,
          role: (values.role ?? "user") as "user" | "admin" | "moderator",
        },
      },
      headers: await headers(),
    });

    // ✅ Fetch the updated user to return it for React Query cache
    const updatedUser = await getUserById(id);

    return { success: true, message: "User updated successfully.", user: updatedUser };
  } catch (error) {
    return { success: false, message: "Error updating user", error };
  }
}



/* CRUD FOR Categories   */

export async function getCategory(): Promise<Category[]> {

  const session = await getSession();
  if (!session) redirect("/login");

  const category = await db.select().from(categories);

  return category;
}

export async function createCategory(values: NewCategory) {
  await db.insert(categories).values({
    name: values.name,
    description: values.description,
    slug: values.slug,
    image: values.image,
    isActive: values.isActive,
  });
  revalidatePath("/categories");

}

export async function deleteCategory(id: string): Promise<void> {
  const session = await getSession();
  if (!session) return;
  const has = await can(session, { categories: ["delete"] });    // Check permission to delete category
  if (!has) return redirect("/login/?error=notauthorised");
  await db.delete(categories).where(eq(categories.id, id));     // If successful delete category
  revalidatePath("/categories");
}

export async function updateCategory(id: string, values: Partial<NewCategory>) {
  const session = await getSession();
  if (!session) return;
  const has = await can(session, { categories: ["update"] });    // Check permission to delete category
  if (!has) return { success: false, message: "You do not have permission to update categories." };
  try {
    await db.update(categories).set({
      name: values.name,
      description: values.description,
      slug: values.slug,
      image: values.image,
      isActive: values.isActive,
    }).where(eq(categories.id, id));
    revalidatePath("/categories");

    const updatedCategory = await getCategoryById(id);
    return { success: true, message: "Category updated successfully", category: updatedCategory };

  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : String(error);

    return {
      success: false,
      message: `Unable to update category: ${errorMessage}`
    };
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {

  const session = await getSession();
  if (!session) return null;

  const category = await db.select().from(categories).where(eq(categories.id, id)).limit(1).execute();

  return category[0] ?? null;
}



// CRUD FOR PRODUCTS


export async function getProductById(id: string): Promise<OnlyProduct | null> {
  const session = await getSession();
  if (!session) return null;

  try {
    const result = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    return result[0] ?? null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}





 export async function getProductBySlug(slug: string): Promise<Product | null> {

  const session = await getSession();
  if (!session) return null;
  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: {
      category: true,
      variants: {
        with: {
          attributes: true,
        },
      },
    },
  });

  return product ?? null;
      }

export async function getProducts(): Promise<Product[]> {
  const allProducts = await db.query.products.findMany({
    with: {
      category: true,
      variants: {
        with: {
          attributes: true,
        },
      },
    },
  });

  return allProducts;

}

export async function getProductWithCategory(id: string): Promise<Product | null> {
  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      category: true,
      variants: {
        with: {
          attributes: true,
        },
      },
    },
  });

  return product ?? null;
}

export async function createProduct(values: NewProduct) {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const result = await db.transaction(async (tx) => {
      // Step 1 — Insert product
      const insertedProduct = await tx
        .insert(products)
        .values({
          name: values.name,
          slug: values.slug,
          description: values.description,
          isActive: values.isActive,
          categoryId: values.categoryId,
          tags: values.tags || [],
        })
        .returning({ id: products.id });

      const productId = insertedProduct[0].id;

      // Step 2 — Insert product variants
      if (values.variants?.length) {
        for (const variant of values.variants) {
          const insertedVariant = await tx
            .insert(productVariants)
            .values({
              productId,
              sellPrice: variant.sellPrice,
              costPrice: variant.costPrice,
              stock: variant.stock,
              isActive: variant.isActive,
              images: variant.images || [],
            })
            .returning({ id: productVariants.id });

          const variantId = insertedVariant[0].id;

          // Step 3 — Insert variant attributes
          if (variant.attributes?.length) {
            const attributesToInsert = variant.attributes.map((attr) => ({
              variantId,
              name: attr.name,
              value: attr.value,
            }));

            await tx.insert(variantAttributes).values(attributesToInsert);
          }
        }
      }

      return productId;
    });

    return { success: true, productId: result };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error };
  }
}



export async function deleteProduct(id: string): Promise<void> {
  const session = await getSession();
  if (!session) return;
  // const has = await can(session, { products: ["delete"] });    // Check permission to delete product
  // if (!has) return redirect("/login/?error=notauthorised");
  await db.delete(products).where(eq(products.id, id));     // If successful delete product
  revalidatePath("/products");
}



export async function updateProduct(id: string, values: Partial<NewProduct>) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  const updatedProduct = await db.transaction(async (tx) => {
    await tx.update(products)
      .set({
        name: values.name,
        slug: values.slug,
        description: values.description,
        isActive: values.isActive,
        categoryId: values.categoryId,
        tags: values.tags || [],
        updatedAt: new Date(),
      })
      .where(eq(products.id, id));

    if (values.variants) {
      await tx.delete(productVariants).where(eq(productVariants.productId, id));
      for (const variant of values.variants) {
        const [insertedVariant] = await tx.insert(productVariants).values({
          productId: id,
          sellPrice: variant.sellPrice,
          costPrice: variant.costPrice,
          stock: variant.stock,
          isActive: variant.isActive ?? true,
          images: variant.images ?? [],
        }).returning({ id: productVariants.id });

        if (variant.attributes?.length) {
          await tx.insert(variantAttributes).values(
            variant.attributes.map(attr => ({
              variantId: insertedVariant.id,
              name: attr.name,
              value: attr.value,
            }))
          );
        }
      }
    }

    const [product] = await tx.select().from(products).where(eq(products.id, id));
    return product;
  });

  return {
    success: true,
    message: "Product updated successfully",
    product: updatedProduct,
  };
}



// CRUD for Coupons

export async function getCoupons() {

  const session = await getSession();
  if (!session) redirect("/login");

  const coupon = await db.select().from(coupons);

  return coupon;
}

export async function createCoupon(values: NewCoupon) {
  await db.insert(coupons).values({
    code: values.code,
    discountType: values.discountType,
    discountValue: values.discountValue,
    isActive: values.isActive,
    expiry: values.expiry,
    usageLimit: values.usageLimit,
    usedCount: values.usedCount,
  });
  revalidatePath("/coupons");

}

export async function deleteCoupon(id: string): Promise<void> {
  const session = await getSession();
  if (!session) return;
  await db.delete(coupons).where(eq(coupons.id, id));     // If successful delete coupon
  revalidatePath("/coupons");
}

export async function getCouponById(id: string): Promise<Coupon | null> {

  const session = await getSession();
  if (!session) return null;
  const coupon = await db.select().from(coupons).where(eq(coupons.id, id)).limit(1).execute();

  return coupon[0] ?? null;
}

export async function updateCoupon(id: string, values: Partial<NewCoupon>) {
  const session = await getSession();
  if (!session) return;
  const has = await can(session, { coupons: ["update"] });    // Check permission to delete coupon
  if (!has) return { success: false, message: "You do not have permission to update coupons." };
  try {
    await db.update(coupons).set({
      code: values.code,
      discountType: values.discountType,
      discountValue: values.discountValue,
      isActive: values.isActive,
      expiry: values.expiry,
      usageLimit: values.usageLimit,
      usedCount: values.usedCount,
    }).where(eq(coupons.id, id));

    const updatedCoupon = await getCouponById(id);
    return { success: true, message: "Coupon updated successfully", coupon: updatedCoupon };

  } catch (error) {

    return { success: false, message: `Unable to update coupon ${error}` }

  }



}


// CART

export async function addToCart(
  productId: string,
  sellPrice: number,
  action: "increase" | "decrease" = "increase"
) {
  const session = await getSession();
  if (!session) return { success: false, message: "Please Login First" };

  const userId = session.user.id;
  const quantityChange = action === "increase" ? 1 : -1;

  // 1️⃣ Check if user already has a cart
  let existingCart = await db.query.cart.findFirst({
    where: eq(cart.userId, userId),
  });

  let cartId: string;

  if (existingCart) {
    cartId = existingCart.id;
  } else {
    // 2️⃣ Create new cart
    const [newCart] = await db
      .insert(cart)
      .values({ userId })
      .returning();
    cartId = newCart.id;
  }

  // 3️⃣ Check for existing cart item
  const existingItem = await db.query.cartItems.findFirst({
    where: (fields, { and, eq }) =>
      and(eq(fields.cartId, cartId), eq(fields.productId, productId)),
  });

  if (existingItem) {
    // 4️⃣ Calculate new quantity
    const newQuantity = existingItem.quantity + quantityChange;

    if (newQuantity <= 0) {
      // 🗑️ Remove item if quantity drops to 0
      await db
        .delete(cartItems)
        .where(eq(cartItems.id, existingItem.id));
      return { success: true, message: "Item removed from cart", cartId };
    }

    // ✅ Update item quantity
    await db
      .update(cartItems)
      .set({ quantity: newQuantity })
      .where(eq(cartItems.id, existingItem.id));

    return { success: true, message: "Cart updated", cartId };
  }

  // 5️⃣ Add new item if not exists and user increases
  if (action === "increase") {
    await db.insert(cartItems).values({
      cartId,
      productId,
      quantity: 1,
      price: sellPrice,
    });
    return { success: true, message: "Item added to cart", cartId };
  }

  // 🚫 Prevent decreasing non-existing item
  return { success: false, message: "Item not found in cart" };
}



export async function getCart() {
  try {
    const session = await getSession();
    if (!session) return [];

    const userId = session.user.id;

    // 1️⃣ Find the user's cart
    const userCart = await db.query.cart.findFirst({
      where: eq(cart.userId, userId),
    });
    if (!userCart) return [];

    // 2️⃣ Fetch cart items with related product and variant info
    const items = await db.query.cartItems.findMany({
      where: eq(cartItems.cartId, userCart.id),
      with: {
        product: {
          with: {
            variants: true, // include variants
          },
        },
      },
    });

    // 3️⃣ Map to desired shape
    return items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      name: item.product?.name ?? "",
      description: item.product?.description ?? "",
      image: item.product?.variants?.[0]?.images ?? [],
    }));
  } catch (err) {
    console.error("Error fetching cart:", err);
    return [];
  }
}



// Delete cart item
export async function deleteCartItem(cartItemId: string) {
  const session = await getSession();
  if (!session) return { success: false, message: "Please Login First" };
  try {
    await db.delete(cartItems).where(eq(cartItems.id, cartItemId));
    return { success: true, message: "Item removed from cart" };
  } catch (error) {
    return { success: false, message: "Error removing item from cart" };
  }
}


// Profile details

export default async function getProfileByUserId(userId: string): Promise<ProfileWithUser | null> {
  const session = await getSession();
  if (!session) return redirect("/login");

  const userProfile = await db.query.profile.findFirst({
    where: eq(profile.userId, userId),
    with: {
      user: true,
    },
  });

  return userProfile ?? null;

}


export async function getUserWithProfileById(userId: string): Promise<UserWithProfile | null> {
  const session = await getSession();
  if (!session) return redirect("/login");

  const userWithProfile = await db.query.user.findFirst({
    where: eq(users.id, userId),
    with: {
      profile: true,
    },
  });

  return userWithProfile ?? null;

}

export async function updateProfile(userId: string, values: UserWithProfile) {
  console.log("Incoming profile data:", values);

  const session = await getSession();
  if (!session) return { success: false, message: "Not logged in" };

  try {
    const result = await db.transaction(async (tx) => {
      await tx.update(users)
        .set({
          name: values.name ?? undefined,
          email: values.email ?? undefined,
          banned: values.banned ?? false,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));

      const existingProfile = await tx.query.profile.findFirst({
        where: eq(profile.userId, userId),
      });

      console.log("Existing profile:", existingProfile);

      if (existingProfile) {
        await tx.update(profile)
          .set({
            bio: values.profile?.bio ?? null,
            location: values.profile?.location ?? null,
            address: values.profile?.address ?? null,
            mobile: values.profile?.mobile ?? existingProfile.mobile,
            updatedAt: new Date(),
          })
          .where(eq(profile.userId, userId));
      } else {
        if (!values.profile?.mobile) {
          throw new Error("Mobile number required");
        }
        await tx.insert(profile).values({
          userId,
          bio: values.profile?.bio ?? null,
          location: values.profile?.location ?? null,
          address: values.profile?.address ?? null,
          mobile: values.profile.mobile,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      return await getProfileByUserId(userId);
    });

    return { success: true, message: "Profile updated", profile: result };
  } catch (error) {
    return { success: false, message: "Profile update failed" };
  }
}


// Fetch Order and Order Items by User ID

export async function getOrdersByUserId(userId: string) {
  const session = await getSession();
  if (!session) return redirect("/login");

  const ordersOfUser = await db.query.orders.findMany({
    where: eq(orders.userId, userId),
    with: {
      orderItems: {
        with: {
          product: {
            with: {
              variants: true,
            },
          },
        },
      },
    },
    orderBy: [desc(orders.createdAt)],
  });

  return ordersOfUser;
}


export async function getAllOrders() {
  const session = await getSession();
  if (!session) return redirect("/login");

  const allOrders = await db.query.orders.findMany({
    with: {
      user: true, // 👈 include user info
      orderItems: {
        with: {
          product: {
            with: {
              variants: true,
              category: true,
            },
          },
        },
      },
    },
    orderBy: [desc(orders.createdAt)],
  });

  return allOrders ?? [];
}




export async function updateOrderStatus(orderId: string, newStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "returned") {
  try {
    await db
      .update(orders)
      .set({ status: newStatus })
      .where(eq(orders.id, orderId))

    return { success: true }
  } catch (error) {
    console.error("Failed to update order status:", error)
    throw new Error("Database update failed")
  }
}


// Comment create

export async function createComment(values: {
  userId: string;
  productId: string;
  rating: number;
  comment?: string;
}) {
  const session = await getSession();
  if (!session) return { success: false, message: "Please Login First" };

  try {
    const comment = await db.insert(comments).values({
      userId: values.userId ?? session.user.id,
      productId: values.productId,
      rating: values.rating ?? 0,
      comment: values.comment ?? "",
    });
    return { success: true, message: "Comment created successfully" };
  } catch (error) {
    console.error("Create comment error:", error);
    return { success: false, message: "Failed to create comment" };
  }
}
