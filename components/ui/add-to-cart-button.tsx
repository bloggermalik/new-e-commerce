"use client";
import { Button } from "./button";
import { addToCart, getCart } from "@/server/user";
import { CartItem, GetCartItem } from "@/types/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "./get-error-message";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  productId: string;
  sellPrice: number;
  className?: string;
}

export default function AddToCartButton({
  productId,
  sellPrice,
  className,
}: AddToCartButtonProps) {
  const queryClient = useQueryClient();
  // 🔥 Read cart
  const { data: cart = [] } = useQuery<GetCartItem[]>({
    queryKey: ["cart"],
    queryFn: getCart,
  });
  const isAlreadyInCart = cart.some((item) => item.productId === productId);

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
      queryClient.setQueryData<GetCartItem[]>(["cart"], (old = []) => {
        const existingItem = old.find((item) => item.productId === productId);

        if (existingItem) {
          toast.info("Product already in cart. Go to Cart.");
          return old.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }

        return [
          ...old,
          {
            id: crypto.randomUUID(),
            productId,
            quantity: 1,
            price: sellPrice,
            name: "Loading...",
            description: "",
            image: [],
            optimistic: true,
          },
        ];
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
  });
  console.log("Product added from cart is", productId, sellPrice);
  return (
    <div className={cn("flex justify-end w-full", className)}>
      <Button
        onClick={() => {
            if (isAlreadyInCart) {
              toast.info("Product already in cart. Go to Cart.");
              return; // ❌ Stop here — do NOT call mutate()
            }
            mutate(); // ✅ Only run for new items
          }}

        disabled={isPending }
        variant="outline"
        className={
          cn("group mt-3 max-w-lg text-sm font-semibold border-primary text-primary bg-white hover:bg-primary hover:text-white transition-colors",
            isAlreadyInCart && "opacity-50 hover:bg-white hover:text-primary"
          )
        }
      >
        {isAlreadyInCart ? (
          "Added"
        ) : (
          <>
            <Plus className="h-5 w-5 mr-1 text-primary group-hover:text-white transition-colors duration-200" />
            Add
          </>
        )}
      </Button>
    </div>
  );
}
