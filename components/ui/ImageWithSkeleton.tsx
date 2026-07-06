"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

interface ImageWithSkeletonProps extends ImageProps {
  skeletonClassName?: string;
}

export function ImageWithSkeleton({
  src,
  alt,
  className = "",
  skeletonClassName = "",
  ...props
}: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Skeleton / Blur placeholder */}
      {!isLoaded && (
        <div
          className={`absolute inset-0 bg-white/5 animate-pulse ${skeletonClassName}`}
        />
      )}

      {/* Actual Image */}
      <Image
        src={src}
        alt={alt}
        className={`transition-opacity duration-500 ease-in-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
}
