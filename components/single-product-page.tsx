"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Product } from "@/types/type";
import { Loader2, Truck } from "lucide-react";
import AddToCartButton from "./ui/add-to-cart-button";
import { useQuery } from "@tanstack/react-query";
import { getCommentsByProductId } from "@/server/comment";
import { Rating } from "@mui/material";
import { Separator } from "@radix-ui/react-separator";
import { useSwipeable } from "react-swipeable";
import ProductImageGallery from "@/app/(store)/products/[slug]/ProductImageGallery";


export function SingleProductPage({
  product,
  userId,
}: {
  product: Product;
  userId?: string;
}) {
  const images = product.variants?.[0]?.images || ["/placeholder.png"];
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null);





  const { data: allProductComment, isLoading } = useQuery({
    queryKey: ["comments", product.id],
    queryFn: async () => await getCommentsByProductId(product.id),
  });

  const avgRating =
    allProductComment && allProductComment.length > 0
      ? (
        allProductComment.reduce((sum, c) => sum + c.rating, 0) /
        allProductComment.length
      ).toFixed(1)
      : "0";


  console.log("Comment for product is", allProductComment);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };


  const handlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    trackMouse: true,
  });

  useEffect(() => {
    setSelectedImage(images[currentIndex]);
  }, [currentIndex, images]);

  console.log("Product description is ", product.description)


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-4 py-8 max-w-7xl mx-auto">
      {/* Left side — Image gallery */}
      <div className="flex flex-col items-center w-full space-y-4">
        {/* <div
          {...handlers}
          className="relative w-full aspect-square bg-gray-100 rounded-2xl overflow-hidden"
        >
          <div
            className="flex h-full w-full transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((img, i) => (
              <div key={i} className="relative w-full h-full shrink-0">
                <Image
                  src={img}
                  alt={`Image ${i}`}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div> */}

 <ProductImageGallery
          images={images || []}
          productName={product.name}
        />



        {/* Thumbnail images */}
        {images.length > 1 && (
          <div className="flex gap-3 flex-wrap justify-center">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}

                className={`relative w-8 h-8 rounded-md overflow-hidden border-2 ${selectedImage === img
                  ? "border-primary"
                  : "border-transparent"
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
          <Rating
            name="avg-rating"
            value={Number(avgRating)}
            precision={0.1}
            readOnly
            size="small"
          />

          <span className="text-xs text-gray-700">
            {avgRating}  ({allProductComment?.length || 0} reviews)
          </span>
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
        <div className=" flex">
          <AddToCartButton
            productId={product.id}
            sellPrice={product.variants[0].sellPrice}
            className="justify-start w-[80px]"
          />

          {/* Free Delivery Badge */}
          <div className="max-w-[220px] mt-3 flex items-center gap-1 bg-green-100 text-green-700 ml-3 sm:ml-4 px-3 sm:px-5 py-2 rounded-full text-xs font-medium">
            <Truck className="w-4 h-4" />
            <span>Free delivery above ₹900</span>
          </div>
        </div>
        {/* Product Description */}
        <Separator className="my-6 bg-gray-200 w-full h-0.5" />
        <div className="prose max-w-none [&_p]:mb-4 [&_div]:mb-4 [&_p]:leading-relaxed [&_div]:leading-relaxed">
          <h2 className="text-lg font-medium mb-3">Product Description</h2>

          <div
            dangerouslySetInnerHTML={{
              __html: product.description || "<p>No description available.</p>",
            }}
          />
        </div>


        {/* Comments Section */}
        <Separator className="my-6 bg-gray-200 w-full h-0.5" />

        <div className="">
          <h2 className="text-lg font-medium mb-3">Customer Reviews</h2>

          <div className="overflow-y-auto space-y-4 pr-2">
            {/* Loading state */}
            {isLoading && (
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              </div>
            )}


            {/* Comments */}
            {!isLoading && allProductComment && allProductComment.length > 0
              ? allProductComment.map((comment) => (
                <div
                  key={comment.id}
                  className=" rounded-lg p-4 border-b border-gray-200 transition-all"
                >
                  {/* User + Rating */}
                  <div className="flex items-center justify-between mb-1">


                    <div className="flex items-center">
                      <Rating
                        name="read-only-rating"
                        value={comment.rating}
                        precision={0.5}
                        readOnly
                        size="small"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        {comment.rating}/5
                      </span>
                    </div>
                    <span className="text-gray-500 text-xs">
                      -{comment.userName || "Anonymous"}
                    </span>
                  </div>

                  {/* Comment text */}
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {comment.comment}
                  </p>

                  {/* Created At */}
                  {comment.createdAt && (
                    <p className="text-gray-400 text-xs mt-2">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))
              : !isLoading && (
                <p className="text-gray-500 text-sm">
                  No reviews yet. Be the first to review this product!
                </p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
