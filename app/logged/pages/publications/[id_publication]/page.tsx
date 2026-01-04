"use client";

import { useParams } from "next/navigation";

import publications from "@/app/contents/publicationsContents.json";
 
import { publicationInterface } from "@/app/contents/interfaces";


import PublicationHeader from "./id_publication_components/PublicationHeader";
import PublicationInfo from "./id_publication_components/PublicationInfo";
import { useState } from "react";



type EditTarget =
  | { kind: "articleTitle" }
  | { kind: "articleSubtitle" }
  | { kind: "articleMainImage" }
  | { kind: "content"; contentId: string; field: "center" | "left" | "right" };

export default function IdPubblicationPage() {
  const params = useParams();
  const id_publication = params?.id_publication as string;
  const selectedPublication = publications.find(
    (publication: publicationInterface) => publication.id_publication === id_publication
  );

  if (!selectedPublication) {
    return (
      <main style={{ padding: "1rem" }}>
        <p className="text-red-500">
          The publication you are looking for does not exist.
        </p>
      </main>
    );
  }

  const [publicationData, setPublicationData] = useState<publicationInterface>(
    selectedPublication
  );

  const handleEditName = () => {
    console.log("Edit name");
  };

  const handleEditDate = () => {
    console.log("Edit date");
  };

  const handleEditRevista = () => {
    console.log("Edit revista");
  };
  const handleEditEdicion = () => {
    console.log("Edit edicion");
  };

  const handleEditNumber = () => {
    console.log("Edit número");
  };

  return (
    <>
      <main className="flex h-full min-h-screen flex-col gap-6 bg-white px-24 py-10 text-gray-600 w-full">
        <PublicationHeader
          title={publicationData.publicationTitle}
          publicationName={publicationData.publicationName}
          onEditName={handleEditName}
        />

        <PublicationInfo
          date={publicationData.date}
          revista={publicationData.revista}
          edición={publicationData.edición}
          número={publicationData.número}
          onEditDate={handleEditDate}
          onEditRevista={handleEditRevista}
          onEditEdicion={handleEditEdicion}
          onEditNumero={handleEditNumber}
        />
      </main>

    
    </>
  );
}
