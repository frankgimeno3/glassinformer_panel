"use client";

import { FC } from "react";
import PencilSvg from "@/app/logged/logged_components/svg/PencilSvg";
import Image from "next/image";
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
      <Image
        // src={imageUrl}
        src={"https://images.unsplash.com/photo-1761839257658-23502c67f6d5?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} 
        alt="Article main image"
        className="min-h-50 w-full rounded-lg shadow-md text-right text-xs"
        width={100}
        height={100}
      />
      <div className="absolute bottom-2 right-2 z-20">
        <PencilSvg size="10" onClick={onEditMainImage} />
      </div>
    </section>
  );
};

export default ArticleMainImage;
