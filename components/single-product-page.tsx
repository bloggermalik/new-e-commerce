"use client"

import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Product } from "@/types/type"

export function SingleProductPage(product: Product) {
    const images = product.variants?.[0]?.images || ["/placeholder.png"]
    const [selectedImage, setSelectedImage] = useState(images[0])
    const [currentIndex, setCurrentIndex] = useState(0)

    // Handle swipe or next/prev navigation
    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length)
        setSelectedImage(images[(currentIndex + 1) % images.length])
    }

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
        setSelectedImage(images[(currentIndex - 1 + images.length) % images.length])
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-4 py-8 max-w-6xl mx-auto">
            {/* Left side — Image gallery */}
            <div className="flex flex-col items-center w-full space-y-4">
                <div className="relative w-full aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                    <Image
                        src={selectedImage}
                        alt={product.name}
                        fill
                        className="object-contain transition-all duration-300"
                        priority
                    />

                    {/* Navigation buttons for swipe/slide */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={handlePrev}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow"
                            >
                                ◀
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow"
                            >
                                ▶
                            </button>
                        </>
                    )}
                </div>

                {/* Thumbnail images */}
                {images.length > 1 && (
                    <div className="flex gap-3 flex-wrap justify-center">
                        {images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setSelectedImage(img)
                                    setCurrentIndex(i)
                                }}
                                className={`relative w-20 h-20 rounded-md overflow-hidden border-2 ${selectedImage === img ? "border-primary" : "border-transparent"
                                    }`}
                            >
                                <Image
                                    src={img}
                                    alt={`Thumbnail ${i + 1}`}
                                    fill
                                    className="object-cover hover:scale-105 transition-transform"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Right side — Product Info */}
            <div className="flex flex-col space-y-2 text-gray-900 font-sans">

                {/* Product Name */}
                <h1 className="text-xl font-semibold">{product.name}</h1>
                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="#FBBF24"
                            className="w-4 h-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.951a1 1 0 00.95.69h4.152c.969 0 1.371 1.24.588 1.81l-3.36 2.442a1 1 0 00-.364 1.118l1.286 3.951c.3.921-.755 1.688-1.54 1.118l-3.36-2.442a1 1 0 00-1.175 0l-3.36 2.442c-.784.57-1.838-.197-1.539-1.118l1.285-3.951a1 1 0 00-.364-1.118L2.973 9.378c-.783-.57-.38-1.81.588-1.81h4.152a1 1 0 00.95-.69l1.286-3.951z"
                            />
                        </svg>
                    ))}
                    <span className="text-gray-500 text-sm">.0</span>
                </div>

                {/* Price & Discount */}
                <div className="flex items-center gap-1">
                    <span className="text-2xl font-semibold ">
                        ₹{product.variants?.[0]?.sellPrice ?? "N/A"}
                    </span>
                    {product.variants?.[0]?.costPrice && (
                        <>
                            <span className="text-gray-500 line-through text-sm ">
                                ₹{product.variants[0].costPrice}
                            </span>

                        </>
                    )}

                </div>
                {/* Dicount percentage */}
                <p className="text-green-600 font-semibold text-md">
                    {product.variants[0].costPrice &&
                        product.variants[0].sellPrice &&
                        Math.round(
                            ((product.variants[0].costPrice - product.variants[0].sellPrice) /
                                product.variants[0].costPrice) *
                            100
                        )}
                    % off
                </p>

                {/* Add to Cart / Buy Now Buttons */}
                <div className="flex pt-2">
                    <Button className="bg-primary text-white hover:bg-primary/90">
                        Add to Cart
                    </Button>
                </div>
                {/* Product Description */}
                <div>
                <p className="text-lg font-medium mt-4 mb-2">Product Description</p>
                <div
                    className="text-gray-600 leading-relaxed text-base"
                    dangerouslySetInnerHTML={{
                        __html: product.description || "<p>No description available.</p>",
                    }}
                ></div>
                </div>
                {/* Comments Section */}
                <div className="">
                    <h2 className="text-lg font-medium mt-4 mb-2">Customer Reviews</h2>
                    <div className=" max-h-40 overflow-y-auto">

                        <p className="text-gray-500 text-sm">No reviews yet.</p>

                    </div>
                </div>
            </div>

        </div>
    )
}
