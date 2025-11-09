"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Product } from "@/types/type"

export function SingleProductPage(product: Product) {
  const [selectedImage, setSelectedImage] = useState(
    product.variants?.[0]?.images?.[0] || "/placeholder.png"
  )

  return (
    <motion.div
      layoutId={`product-image-${product.id}`} // shared layout animation from home
      className="container mx-auto px-4 py-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left side — Product Images */}
        <div className="flex flex-col gap-4">
          <motion.div
            layoutId={`product-image-${product.id}-main`}
            className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-md"
          >
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Thumbnail images */}
          <div className="flex gap-3 justify-center mt-2">
            {product.variants?.[0]?.images?.map((img, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedImage(img)}
                className={`relative w-16 h-16 rounded-xl overflow-hidden cursor-pointer border-2 ${
                  selectedImage === img ? "border-primary" : "border-transparent"
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right side — Product Info */}
        <div className="flex flex-col justify-center space-y-5">
          <motion.h1
            className="text-3xl font-semibold"
            layoutId={`product-title-${product.id}`}
          >
            {product.name}
          </motion.h1>

          <motion.p
            layoutId={`product-price-${product.id}`}
            className="text-2xl font-medium text-primary"
          >
            ₹{product.variants?.[0]?.sellPrice ?? "N/A"}
          </motion.p>

          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          {/* Add to Cart or Buy Now buttons */}
          <div className="flex gap-3 mt-4">
            <Button className="bg-primary text-white hover:bg-primary/90">
              Add to Cart
            </Button>
            <Button variant="outline">Buy Now</Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
