"use client";

import React, { FC } from "react";
import PencilSvg from "@/app/logged/logged_components/svg/PencilSvg";

interface PublicationHeaderProps {
  title: string;
  publicationName: string;
  onEditName: () => void;
}

const PublicationHeader: FC<PublicationHeaderProps> = ({
  title,
  publicationName,
  onEditName,
}) => {
  return (
    <header className="flex flex-col gap-3">
      {/* Título principal con Pencil */}
      <div className="relative flex flex-row">
        <h1 className="text-4xl font-bold">{title}</h1>
      </div>

      {/* Nombre de publicación con Pencil */}
      <div className="relative flex flex-row">
        <h2 className="text-xl text-gray-500">{publicationName}</h2>
        <div className="absolute bottom-0 right-[-25px]">
          <PencilSvg size="10" onClick={onEditName} />
        </div>
      </div>
    </header>
  );
};

export default PublicationHeader;





