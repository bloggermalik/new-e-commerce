// app/(store)/page.tsx
import { db } from "@/db/drizzle"
import { unstable_cache } from "next/cache"
import ProductList from "@/components/product-list"

export const revalidate = 3600

const getCachedProducts = unstable_cache(
  async () => {
    return await db.query.products.findMany({
      with: { variants: true },
    })
  },
  ["products"],
  { revalidate: 3600, tags: ["products"] }
)

export default async function Page() {
  const products = await getCachedProducts()
  return <ProductList products={products} />
}






