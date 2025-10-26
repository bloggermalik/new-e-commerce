"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCart, addToCart } from "@/server/user";
import { Button } from "./button";
import Image from "next/image";
import { toast } from "sonner";
import StepProgressBar from "../step-progress-bar";
import Link from "next/link";
import { CircleMinus, CirclePlus } from "lucide-react";

export default function CartPage() {
  const queryClient = useQueryClient();
  const [activeId, setActiveId] = useState<string | null>(null); // 👈 Track which item is being updated

  // ✅ Fetch cart data
  const { data: cart = [], isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  // ✅ Mutation for Add / Increase / Decrease (with optimistic updates)
  const mutation = useMutation({
    mutationFn: async ({
      productId,
      sellPrice,
      action,
    }: {
      productId: string;
      sellPrice: number;
      action: "increase" | "decrease";
    }) => {
      setActiveId(productId); // Track active button
      return await addToCart(productId, sellPrice, action);
    },

    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData<any[]>(["cart"]);

      queryClient.setQueryData(["cart"], (old: any[] = []) => {
        const existingItem = old.find(
          (item) => item.productId === newItem.productId
        );

        // ✅ If product exists in cart
        if (existingItem) {
          if (newItem.action === "increase") {
            return old.map((item) =>
              item.productId === newItem.productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else if (newItem.action === "decrease") {
            if (existingItem.quantity <= 1) {
              toast.warning("Item removed");
              // Keep original order by filtering after map
              return old.filter(
                (item) => item.productId !== newItem.productId
              );
            }
            return old.map((item) =>
              item.productId === newItem.productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            );
          }
        }

        // ✅ If item doesn't exist and user adds
        if (newItem.action === "increase") {
          return [
            ...old,
            {
              productId: newItem.productId,
              price: newItem.sellPrice,
              quantity: 1,
              name: "New Product",
              image: ["/placeholder.png"],
              optimistic: true,
            },
          ];
        }

        return old;
      });

      return { previousCart };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousCart)
        queryClient.setQueryData(["cart"], context.previousCart);
      toast.error("Cart update failed");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setActiveId(null); // Reset active item
    },
  });

  const { mutate } = mutation;

  // ✅ Loading / Empty states
  if (isLoading) return <p>Loading cart...</p>;
  if (!cart.length) return <p>Your cart is empty</p>;

  // ✅ Calculate total
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">

      <StepProgressBar />

      {cart.map((item) => (
        <div
          key={item.productId}
          className="flex items-center gap-4 border-b pb-4"
        >
          <Link href={`/product/${item.productId}`} className="block">
          <Image
            src={item.image?.[0] || "/placeholder.png"}
            alt={item.name || "Product"}
            width={50}
            height={50}
            className="object-contain rounded-md"
          />
          </Link>

          <div className="flex-1">
            <h3 className="font-medium text-xs md:text-sm">{item.name}</h3>
          
            <p className="text-gray-400 text-xs mt-1">
              ₹{item.price} × {item.quantity}
            </p>
          </div>

          {/* ✅ Quantity Counter */}
          <div className="flex items-center gap-1">
            <Button
              variant={"outline"}
              onClick={() =>
                mutate({
                  productId: item.productId,
                  sellPrice: item.price,
                  action: "decrease",
                })
              }
              className="h-8 w-8 text-lg bg-white border border-0"
            >
                <CircleMinus className="!h-8 !w-8 !text-red-500" />

            </Button>

            <span className="min-w-[20px] text-center">{item.quantity}</span>

            <Button
              variant={"outline"}
              onClick={() =>
                mutate({
                  productId: item.productId,
                  sellPrice: item.price,
                  action: "increase",
                })
              }
              className="h-8 w-8 text-lg bg-white border-0"
            >
                             <CirclePlus className="!h-8 !w-8 !text-green-500" />

            </Button>
          </div>
        </div>
      ))}

      <div className="text-right font-bold text-lg mt-4">
        Total: ₹{totalPrice}
      </div>
    </div>
  );
}
