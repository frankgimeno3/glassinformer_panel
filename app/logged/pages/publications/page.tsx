"use client";

import { FC, Suspense, useEffect, useState } from "react";
import Link from "next/link";

import publications from "@/app/contents/publicationsContents.json";
import PublicationFilter from "./publication_components/PublicationFilter";
import { PublicationService } from "@/app/service/PublicationService";
import CreatePublicationModal from "./publication_components/CreatePublicationModal";

interface PublicationsProps {}

const Publications: FC<PublicationsProps> = ({}) => {
  const [allPublications, setAllPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPublications = async () => {
    try {
      // Obtener todas las publicaciones del API (incluye las creadas dinámicamente)
      const apiPublications = await PublicationService.getAllPublications();
      
      // Publicaciones originales del JSON estático
      const originalPublications = Array.isArray(publications) ? publications : [];
      const originalIds = new Set(originalPublications.map((p: any) => p.id_publication));
      
      // Publicaciones creadas dinámicamente (las que están en el API pero no en el JSON original)
      const createdPublications = Array.isArray(apiPublications)
        ? apiPublications.filter((pub: any) => !originalIds.has(pub.id_publication))
        : [];
      
      // Combinar: primero las creadas, luego las originales
      const combined = [...createdPublications, ...originalPublications];
      setAllPublications(combined);
    } catch (error) {
      console.error("Error fetching publications:", error);
      // En caso de error, usar solo las del JSON
      const fallback = Array.isArray(publications) ? publications : [];
      setAllPublications(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  return (
    <div className="flex flex-col w-full bg-white">
      <div className="flex flex-col text-center bg-blue-950/70 p-5 px-46 text-white">
        <p className="text-2xl">All publications</p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-950 text-white text-xs px-4 py-1 rounded-xl shadow cursor-pointer w-36 mx-auto mt-2 hover:bg-blue-950/80 inline-block"
        >
          Create publication  
        </button>
      </div>

      <CreatePublicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchPublications}
      />

      <Suspense fallback={<div className='px-36 mx-7'><div className='flex flex-col border border-gray-100 shadow-xl text-center py-2 text-xs'><p>Loading filter...</p></div></div>}>
        <PublicationFilter />
      </Suspense>

      <div className="flex flex-wrap py-5 gap-12 justify-center">
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Cargando publicaciones...</p>
          </div>
        ) : (
          allPublications.map((pub: any, index: number) => ( 
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
          ))
        )}
      </div>
    </div>
  );
};

export default Publications;