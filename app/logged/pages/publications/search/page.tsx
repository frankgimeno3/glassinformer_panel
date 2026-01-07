import { FC } from "react";
import publications from "@/app/contents/publicationsContents.json";
import PublicationSearchClient from "./PublicationSearchClient";

interface PageProps {
  searchParams: Promise<{
    revista?: string;
    numero?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}

const PublicationSearchResults: FC<PageProps> = async ({ searchParams }) => {
  try {
    const params = await searchParams;
    const filters: Record<string, string> = {};

    if (params.revista) filters.revista = params.revista;
    if (params.numero) filters.numero = params.numero;
    if (params.dateFrom) filters.dateFrom = params.dateFrom;
    if (params.dateTo) filters.dateTo = params.dateTo;

    // Filter publications based on search params
    const filteredPublications = publications.filter((pub: any) => {
      // Filter by revista
      if (filters.revista && pub.revista !== filters.revista) {
        return false;
      }

      // Filter by número (using 'numero' in URL to avoid encoding issues)
      if (filters.numero && String(pub.número) !== filters.numero) {
        return false;
      }

      // Filter by date range (from)
      if (filters.dateFrom) {
        const [fromYear, fromMonth] = filters.dateFrom.split('-');
        if (!fromYear || !fromMonth) return false;
        
        try {
          const pubDate = new Date(pub.date);
          if (isNaN(pubDate.getTime())) return false;
          
          const pubYear = String(pubDate.getFullYear());
          const pubMonth = String(pubDate.getMonth() + 1).padStart(2, '0');
          
          const fromDate = new Date(parseInt(fromYear), parseInt(fromMonth) - 1, 1);
          const pubDateObj = new Date(parseInt(pubYear), parseInt(pubMonth) - 1, 1);
          
          if (pubDateObj < fromDate) return false;
        } catch (e) {
          return false;
        }
      }

      // Filter by date range (to)
      if (filters.dateTo) {
        const [toYear, toMonth] = filters.dateTo.split('-');
        if (!toYear || !toMonth) return false;
        
        try {
          const pubDate = new Date(pub.date);
          if (isNaN(pubDate.getTime())) return false;
          
          const pubYear = String(pubDate.getFullYear());
          const pubMonth = String(pubDate.getMonth() + 1).padStart(2, '0');
          
          // Get last day of the month for "to"
          const toDate = new Date(parseInt(toYear), parseInt(toMonth), 0);
          const pubDateObj = new Date(parseInt(pubYear), parseInt(pubMonth) - 1, pubDate.getDate());
          
          if (pubDateObj > toDate) return false;
        } catch (e) {
          return false;
        }
      }

      return true;
    });

    return <PublicationSearchClient filteredPublications={filteredPublications} filters={filters} />;
  } catch (error) {
    return (
      <div className="flex flex-col w-full bg-white">
        <div className="flex flex-col text-center bg-red-500/70 p-5 px-46 text-white">
          <h2 className="text-xl font-semibold">Error</h2>
          <p className="text-xs text-gray-200 mt-1">
            An error occurred while processing your search. Please try again.
          </p>
        </div>
      </div>
    );
  }
};

export default PublicationSearchResults;


