"use client";

import { useState } from "react";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "left") {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    } else if (direction === "right") {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
    trackMouse: true,
  });

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full space-y-4">
      {/* Swipeable Image Gallery with Animation */}
      <div
        {...swipeHandlers}
        className="relative aspect-[4/3] w-full overflow-hidden border rounded-md"
      >
        <div
          className="flex transition-transform duration-500 ease-in-out h-full w-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img, index) => (
            <div className="relative min-w-full h-full" key={index}>
              <Image
                src={img}
                alt={`Main image of ${productName}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      {/* Thumbnails */}
      <div className="overflow-x-auto">
        <div className="flex gap-2 w-max mx-auto">
          {images.map((url, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative p-4 w-15 h-15 rounded-md overflow-hidden border cursor-pointer ${
                currentIndex === idx ? "ring-2 ring-blue-500" : ""
              }`}
            >
              <Image
                src={url}
                alt={`Thumbnail ${idx + 1} of ${productName}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
