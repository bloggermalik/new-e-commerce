// components/product-list.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import AddToCartButton from "@/components/ui/add-to-cart-button"

export default function ProductList({ products }: { products: any[] }) {
  return (
    <div className="flex justify-center p-0 font-sans">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-6 justify-items-center max-w-7xl w-full">
        {products.map((product) => {
          const sellPrice = product.variants[0]?.sellPrice ?? 0
          const costPrice = product.variants[0]?.costPrice ?? 0
          const discount =
            costPrice > 0 ? ((costPrice - sellPrice) / costPrice) * 100 : 0

          return (
            <div
              key={product.id}
              className="bg-white shadow-md p-2 flex flex-col items-center text-lg font-semibold rounded-lg w-full max-w-[250px] hover:shadow-lg !transition"
            >
              <Link
                href={`/products/${product.slug}`}
                className="flex flex-col items-center text-lg font-semibold rounded-lg w-full max-w-[250px] !transition"
              >
                <div className="w-full aspect-square flex items-center justify-center overflow-hidden rounded-md bg-gray-50">
                  {product.variants[0]?.images?.[0] ? (
                      <Image
                        src={product.variants[0].images[0]}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="object-contain w-full h-full"
                      />
                  ) : (
                    <div className="text-gray-400 text-sm">No Image</div>
                  )}
                </div>

                <div className="w-full mt-4 px-2 text-left">
                  <p
                    className="md:text-sm text-xs font-medium text-gray-800 truncate"
                    title={product.name}
                  >
                    {product.name}
                  </p>

                  <p className="text-black text-md font-bold">₹{sellPrice}</p>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs line-through">
                      ₹{costPrice}
                    </span>
                    {discount > 0 && (
                      <span className="text-green-500 text-xs font-medium">
                        {discount.toFixed(0)}% OFF
                      </span>
                    )}
                  </div>
                </div>
              </Link>

              <AddToCartButton productId={product.id} sellPrice={sellPrice} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
