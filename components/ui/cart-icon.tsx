import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CartIcon() {
    return (
        <Link href="/cart">
            <div className="flex gap-1  md:mr-16 mr-4 item-center hidden md:flex">
                <ShoppingBag className="h-7 w-7" />
                <span className="text-lg text-muted-foreground dark:text-white hidden md:block">Cart</span>
            </div>
        </Link>
    )
}