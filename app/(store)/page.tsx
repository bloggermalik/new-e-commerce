
import { Button } from "@/components/ui/button";
import { db } from "@/db/drizzle";
import { getProducts } from "@/server/user";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import Link from "next/link";
export const revalidate = 3600; // Rebuild page every hour

const getCachedProducts = unstable_cache(
  async () => {
    return await db.query.products.findMany({
      with: { variants: true },
    });
  },
  ["products"], // cache key
  { revalidate: 3600, tags: ["products"] } // 1 hour cache
);

async function page() {
  const products = await getCachedProducts()
  return (
    <div className="flex justify-center p-0">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-6 justify-items-center w-full">
        {products.map((product) => {
          // Discount calculation
          const sellPrice = product.variants[0]?.sellPrice ?? 0;
          const costPrice = product.variants[0]?.costPrice ?? 0;
          const discount =
            costPrice > 0 ? ((costPrice - sellPrice) / costPrice) * 100 : 0;

          return (
            <div
              key={product.id}
              className="bg-white shadow-md p-2 flex flex-col items-center text-lg font-semibold rounded-lg w-full max-w-[250px] hover:shadow-lg !transition"
            >
              <Link href={`/products/${product.slug}`} className="bg-white shadow-md p-2 flex flex-col items-center text-lg font-semibold rounded-lg w-full max-w-[250px] hover:shadow-lg !transition">
                {/* Product Image */}
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

                {/* Product Info */}
                <div className="w-full mt-4 px-2 text-left">
                  {/* Product Name */}
                  <p
                    className="text-sm font-medium text-gray-800 truncate"
                    title={product.name} // Tooltip for full name on hover
                  >
                    {product.name}
                  </p>

                  {/* Sell Price */}
                  <p className="text-black text-md font-bold">
                    ₹{sellPrice}
                  </p>

                  {/* Cost price & Discount */}
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

                  {/* Add Button */}
                  <Button className="mt-3 w-full text-sm font-medium">
                    + Add
                  </Button>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default page;
