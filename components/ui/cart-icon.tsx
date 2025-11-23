"use client"
import { getCart } from "@/server/user";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CartIcon() {

    const { data: cart = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart, // function that fetches cart from db/session
  })

    const cartCount = cart?.length || 0


    return (
        <Link href="/cart">
            <div className="relative flex gap-1  md:mr-16 mr-4 item-center hidden md:flex">
                <ShoppingBag className="h-7 w-7" />
                <span className="text-lg text-muted-foreground dark:text-white hidden md:block">Cart</span>
                  {cartCount > 0 && (
                  <span className="absolute -top-3 -left-3 bg-red-500 text-white text-[12px] font-bold rounded-full px-1.5 py-0.5">
                    {cartCount}
                  </span>
                )}
            </div>
        </Link>
    )
}