"use client";

import { FC } from "react";

import publicaciones from "@/app/contents/publicaciones.json";

interface PublicationsProps {}

const Publications: FC<PublicationsProps> = ({}) => {
  return (
    <div className="flex flex-col w-full bg-white">
      <div className="flex flex-col text-center bg-blue-950/70 p-5 px-46 text-white">
        <p className="text-2xl">All publications</p>
      </div>

      <div className="flex flex-wrap py-5 gap-12 justify-center">
        {publicaciones.map((pub, index) => (
          <div
            key={index}
            className="flex flex-col shadow-xl w-80 p-2 border-t border-gray-100 bg-gray-100/50 hover:bg-white min-h-[500px]"
          >
            <div className="w-full h-56 bg-gray-300" />

            <div className="flex flex-col p-3 flex-grow">
              <p className="font-semibold line-clamp-4">{pub.revista} - {pub.edición} - {pub.número}</p>
              <p className="text-sm text-gray-400 italic pt-2">{pub.publication_date}</p>
              
              <div className="flex flex-row flex-wrap gap-2 pt-4">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {pub.revista}
                </span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {pub.edición}
                </span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {pub.número}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Publications;