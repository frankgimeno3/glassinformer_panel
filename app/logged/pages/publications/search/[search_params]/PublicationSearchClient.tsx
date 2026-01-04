"use client";

import { FC } from "react";
import Link from "next/link";
import PublicationFilter from "../../publication_components/PublicationFilter";

const monthNames: { [key: string]: string } = {
  '01': 'Enero', '02': 'Febrero', '03': 'Marzo', '04': 'Abril',
  '05': 'Mayo', '06': 'Junio', '07': 'Julio', '08': 'Agosto',
  '09': 'Septiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre'
};

interface PublicationSearchClientProps {
  filteredPublications: any[];
  filters: Record<string, string>;
}

const PublicationSearchClient: FC<PublicationSearchClientProps> = ({ filteredPublications, filters }) => {

  // Build heading
  const filterDescriptions: string[] = [];
  if (filters.revista) {
    filterDescriptions.push(`Revista: ${filters.revista}`);
  }
  if (filters.número) {
    filterDescriptions.push(`Número: ${filters.número}`);
  }
  if (filters.dateFrom) {
    const [year, month] = filters.dateFrom.split('-');
    const monthName = month ? monthNames[month] || month : '';
    if (month && year) {
      filterDescriptions.push(`Desde: ${monthName} ${year}`);
    }
  }
  if (filters.dateTo) {
    const [year, month] = filters.dateTo.split('-');
    const monthName = month ? monthNames[month] || month : '';
    if (month && year) {
      filterDescriptions.push(`Hasta: ${monthName} ${year}`);
    }
  }

  const heading = filterDescriptions.length > 0
    ? `Publicaciones: ${filterDescriptions.join(', ')}`
    : 'Resultados de búsqueda';

  return (
    <div className="flex flex-col w-full bg-white">
      <div className="flex flex-col text-center bg-blue-950/70 p-5 px-46 text-white">
        <h2 className="text-xl font-semibold">{heading}</h2>
        <p className="text-xs text-gray-200 mt-1">
          {filteredPublications.length} publicación{filteredPublications.length !== 1 ? 'es' : ''} encontrada{filteredPublications.length !== 1 ? 's' : ''}
        </p>
      </div>

      <PublicationFilter />

      <div className="flex flex-wrap py-5 gap-12 justify-center">
        {filteredPublications.length > 0 ? (
          filteredPublications.map((pub: any, index: number) => (
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
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron publicaciones con los filtros seleccionados</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicationSearchClient;

