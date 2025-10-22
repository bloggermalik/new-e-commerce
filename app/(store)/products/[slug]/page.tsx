import { db } from "@/db/drizzle"
import { products } from "@/db/schema"
import { eq } from "drizzle-orm"
import Image from "next/image"
import { JSX } from "react"



export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }): Promise<JSX.Element> {
    const { slug } = await params
    const singleProduct = await db.query.products.findFirst({
        where: eq(products.slug, slug),
        with: {
            variants: true
        }
    })
    if (!singleProduct) return <div>Product not found</div>

    console.log("Single Products is", singleProduct)

    return (
        <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-1/2 aspect-square max-h-[500px] bg-gray-50">
                {singleProduct && <Image src={singleProduct?.variants[0].images[0]} alt={singleProduct.name} fill className="object-contain" />}</div>
            <div className="border-l">
                tretert
            </div>
        </div>
    )
}