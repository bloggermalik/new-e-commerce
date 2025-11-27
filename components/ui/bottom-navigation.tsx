"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, ShoppingCart, Package } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useQuery } from "@tanstack/react-query" // ✅
import { getCart } from "@/server/user"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Cart", href: "/cart", icon: ShoppingCart },
  { name: "Orders", href: "/orders", icon: Package },
]

export default function BottomNav() {
  const pathname = usePathname()

  // ✅ Fetch cart items
  const { data: cart = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart, // function that fetches cart from db/session
  })

  const cartCount = cart?.length || 0

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white dark:bg-neutral-900 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ name, href, icon: Icon }) => {
          const active = pathname === href
          const isCart = name === "Cart"

          return (
            <Link
              key={name}
              href={href}
              className={`relative flex flex-col items-center justify-center gap-1 text-xs transition-all ${active
                ? "text-blue-600 dark:text-blue-400 font-semibold"
                : "text-gray-500 dark:text-gray-400"
                }`}
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-colors ${active
                    ? "stroke-blue-600 dark:stroke-blue-400"
                    : "stroke-gray-500 dark:stroke-gray-400"
                    }`}
                  strokeWidth={2}
                />
                {/* ✅ Badge for Cart */}
                {isCart && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">

                    {/* Ping animation */}
                    {(!active && pathname !== "/checkout") && (
                      <span className="absolute -inset-0.25 animate-[ping_1s_linear_infinite] rounded-full bg-red-400 opacity-75"></span>
                    )}

                    {/* Count */}
                    <span className="relative">{cartCount}</span>
                  </span>
                )}

              </div>
              <span>{name}</span>
            </Link>
          )
        })}

        {/* ✅ Replace Profile with Sidebar Trigger */}
        <SidebarTrigger className="mb-4 block md:hidden" />
      </div>
    </nav>
  )
}
