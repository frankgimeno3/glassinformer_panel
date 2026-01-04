"use client";

import React, { FC } from "react";
import PencilSvg from "@/app/logged/logged_components/svg/PencilSvg";

interface PublicationHeaderProps {
  redirectionLink: string;
  onEditName: () => void;
}

const PublicationHeader: FC<PublicationHeaderProps> = ({
  redirectionLink,
  onEditName,
}) => {
  return (
    <header className="flex flex-col gap-3">
      {/* Redirection Link */}
      <div className="relative flex flex-row">
        <a 
          href={redirectionLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xl text-blue-600 hover:text-blue-800 underline"
        >
          {redirectionLink}
        </a>
        <div className="absolute bottom-0 right-[-25px]">
          <PencilSvg size="10" onClick={onEditName} />
        </div>
      </div>
    </header>
  );
};

export default PublicationHeader;






