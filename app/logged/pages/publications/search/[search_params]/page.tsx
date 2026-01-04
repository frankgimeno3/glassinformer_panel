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
    // Filter by publication_date (year-month)
    if (filters.publication_date) {
      const [year, month] = filters.publication_date.split('-');
      const pubDate = new Date(pub.publication_date);
      const pubYear = String(pubDate.getFullYear());
      const pubMonth = String(pubDate.getMonth() + 1).padStart(2, '0');
      
      if (year && pubYear !== year) return false;
      if (month && pubMonth !== month) return false;
    }

    // Filter by revista
    if (filters.revista && pub.revista !== filters.revista) {
      return false;
    }

    // Filter by edición
    if (filters.edición && pub.edición !== filters.edición) {
      return false;
    }

    // Filter by número
    if (filters.número && String(pub.número) !== filters.número) {
      return false;
    }

    return true;
  });

  return <PublicationSearchClient filteredPublications={filteredPublications} filters={filters} />;
};

export default PublicationSearchResults;
