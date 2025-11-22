"use server";
import { db } from "@/db/drizzle";
import { getSession } from "./user";
import { comments, user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getUserCommentedProducts(): Promise<string[]> {
  const session = await getSession();
  if (!session?.user?.id) return [];

  try {
    const userComments = await db.query.comments.findMany({
      where: eq(comments.userId, session.user.id),
      columns: {
        productId: true,
      },
    });

    // return only productId array
    return userComments.map((c) => c.productId);
  } catch (error) {
    console.error("Error fetching user commented products:", error);
    return [];
  }
}


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

// Get all comments for a product
export async function getCommentsByProductId(productId: string) {
  try {
    const productComments = await db
      .select({
        id: comments.id,
        productId: comments.productId,
        userId: comments.userId,
        rating: comments.rating,
        comment: comments.comment,
        createdAt: comments.createdAt,
        userName: user.name, // 👈 Add username
      })
      .from(comments)
      .leftJoin(user, eq(comments.userId, user.id))
      .where(eq(comments.productId, productId));

    return productComments;
  } catch (error) {
    console.error("Error fetching comments for product:", error);
    return [];
  }
}