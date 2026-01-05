import { FC } from "react";
import publications from "@/app/contents/publicationsContents.json";
import PublicationSearchClient from "./PublicationSearchClient";

interface PageProps {
  params: Promise<{
    search_params: string;
  }>;
}

const PublicationSearchResults: FC<PageProps> = async ({ params }) => {
  const { search_params } = await params;

  const decoded = decodeURIComponent(search_params ?? '');
  const filters = decoded.split('&').reduce((acc, param) => {
    const [key, ...valueParts] = param.split('__');
    if (key && valueParts.length > 0) {
      acc[key] = valueParts.join('__');
    }
    return acc;
  }, {} as Record<string, string>);

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

    // Filter by date range (desde)
    if (filters.dateFrom) {
      const [fromYear, fromMonth] = filters.dateFrom.split('-');
      const pubDate = new Date(pub.date);
      const pubYear = String(pubDate.getFullYear());
      const pubMonth = String(pubDate.getMonth() + 1).padStart(2, '0');
      
      const fromDate = new Date(parseInt(fromYear), parseInt(fromMonth) - 1, 1);
      const pubDateObj = new Date(parseInt(pubYear), parseInt(pubMonth) - 1, 1);
      
      if (pubDateObj < fromDate) return false;
    }

    // Filter by date range (hasta)
    if (filters.dateTo) {
      const [toYear, toMonth] = filters.dateTo.split('-');
      const pubDate = new Date(pub.date);
      const pubYear = String(pubDate.getFullYear());
      const pubMonth = String(pubDate.getMonth() + 1).padStart(2, '0');
      
      // Get last day of the month for "hasta"
      const toDate = new Date(parseInt(toYear), parseInt(toMonth), 0);
      const pubDateObj = new Date(parseInt(pubYear), parseInt(pubMonth) - 1, pubDate.getDate());
      
      if (pubDateObj > toDate) return false;
    }

    return true;
  });

  return <PublicationSearchClient filteredPublications={filteredPublications} filters={filters} />;
};

export default PublicationSearchResults;
