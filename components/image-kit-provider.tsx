import { ImageKitProvider } from "@imagekit/next";
import React from "react";

interface ImageKitProviderProps {
  children: React.ReactNode;
}

export default function ImageKitClientProvider({ children }: ImageKitProviderProps) {
  return (
    <ImageKitProvider urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}>
      {children}
    </ImageKitProvider>
  );
}
