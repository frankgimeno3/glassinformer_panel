"use client";

import { FC } from "react";
import Link from "next/link";

import publications from "@/app/contents/publicationsContents.json";
import PublicationFilter from "./publication_components/PublicationFilter";

interface PublicationsProps {}

const Publications: FC<PublicationsProps> = ({}) => {
  const publicationsArray = Array.isArray(publications) ? publications : [];

  return (
    <div className="flex flex-col w-full bg-white">
      <div className="flex flex-col text-center bg-blue-950/70 p-5 px-46 text-white">
        <p className="text-2xl">All publications</p>
        <Link
          href="/logged/pages/publications/create"
          className="bg-blue-950 text-white text-xs px-4 py-1 rounded-xl shadow cursor-pointer w-36 mx-auto mt-2 hover:bg-blue-950/80 inline-block"
        >
          Create publication
        </Link>
      </div>

      <PublicationFilter />

      <div className="flex flex-wrap py-5 gap-12 justify-center">
        {publicationsArray.map((pub: any, index: number) => ( 
          <Link
            key={index}
            href={`/logged/pages/publications/${pub.id_publication}`}
            className="flex flex-col shadow-xl w-80 p-2 border-t border-gray-100 bg-gray-100/50 hover:bg-white min-h-[500px] cursor-pointer"
          >
            <div className="w-full h-56 bg-gray-300" />

            <div className="flex flex-col p-3 flex-grow">
              <p className="font-semibold line-clamp-4">{pub.revista} - {pub.número}</p>
              <p className="text-sm text-gray-400 italic pt-2">{pub.date}</p>
              
              <div className="flex flex-row flex-wrap gap-2 pt-4">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {pub.revista}
                </span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {pub.número}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Publications;