"use client";

import React, { FC } from "react";
import PencilSvg from "@/app/logged/logged_components/svg/PencilSvg";

interface ArticleMainImageProps {
  imageUrl: string;
  onEditMainImage: () => void;
}

const ArticleMainImage: FC<ArticleMainImageProps> = ({
  imageUrl,
  onEditMainImage,
}) => {
  return (
    <section className="relative w-full">
      <img
        src={imageUrl}
        alt="Article main image"
        className="min-h-50 w-full rounded-lg shadow-md text-right text-xs"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "https://source.unsplash.com/800x600/?nature";
        }}
      />
      <div className="absolute bottom-2 right-2 z-20">
        <PencilSvg size="10" onClick={onEditMainImage} />
      </div>
    </section>
  );
};

export default ArticleMainImage;
