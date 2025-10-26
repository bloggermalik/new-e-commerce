"use client"
import { Button } from "./button";
import { addToCart } from "@/server/user";
import { CartItem } from "@/types/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "./get-error-message";
import { Plus } from "lucide-react";


export default function AddToCartButton({ productId, sellPrice }: { productId: string; sellPrice: number }) {
    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
         mutationFn: async () => {
            const result = await addToCart(productId, sellPrice);
            if (!result.success) {
                throw new Error(result.message); // <-- This makes toast.error work
            }
            return result;
            },
        onMutate: async () => {
            // 1️⃣ Stop ongoing cart queries
            await queryClient.cancelQueries({ queryKey: ["cart"] });

            // 2️⃣ Get current cart before update (for rollback)
            const previousCart = queryClient.getQueryData(["cart"]);

            // 3️⃣ Optimistically update cache
            queryClient.setQueryData<CartItem[]>(["cart"], (old = []) => {
                const existingItem = old.find((item: CartItem) => item.productId === productId);
                if (existingItem) {
                    toast.info("Product already in cart. Go to Cart.");
                    // increment quantity
                    return old.map((item: CartItem) =>
                        item.productId === productId
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    // add new item
                    return [
                        ...old,
                        { productId, sellPrice, quantity: 1, optimistic: true },
                    ];
                }
            });

            // 4️⃣ Return rollback function context
            return { previousCart };
        },
        onSuccess: () => {
            console.log("Product added to cart successfully");
        },

         onError: (error: unknown, _vars, context) => {
            if (context?.previousCart)
                queryClient.setQueryData(["cart"], context.previousCart);
                toast.error(getErrorMessage(error));
            },

    }

    );
    console.log("Product added from cart is", productId, sellPrice);
    return (
        <div className="flex justify-end w-full">
        <Button
  onClick={() => mutate()}
  disabled={isPending}
  variant="outline"
  className="group mt-3 max-w-lg text-sm font-semibold border-primary text-primary bg-white hover:bg-primary hover:text-white transition-colors"
>
  {isPending ? (
    "Added"
  ) : (
    <>
      <Plus className="h-5 w-5 mr-1 text-primary group-hover:text-white transition-colors duration-200" />
      Add
    </>
  )}
</Button>

        </div>
    )
}