import React, { FC } from "react";
import { Content } from "../types";
import ContentCard from "./ContentCard";

interface ArticleFormPhase2Props {
  contents: Content[];
  onAddContent: (position: number | null) => void;
  onEditContent: (content: Content) => void;
  onDeleteContent: (contentId: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const ArticleFormPhase2: FC<ArticleFormPhase2Props> = ({
  contents,
  onAddContent,
  onEditContent,
  onDeleteContent,
  onBack,
  onNext,
}) => {
  const handleDeleteContent = (contentId: string) => {
    if (confirm("¿Está seguro de eliminar este contenido?")) {
      onDeleteContent(contentId);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">Contenidos del Artículo</h2>
      <p className="text-sm text-gray-600">
        Pase el mouse entre los contenidos para agregar uno nuevo. Haga clic en un contenido para editarlo.
      </p>

      <div className="flex flex-col gap-4">
        {contents.length === 0 ? (
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-950 hover:bg-blue-50"
            onClick={() => onAddContent(null)}
          >
            <p className="text-gray-500">Haga clic para agregar el primer contenido</p>
          </div>
        ) : (
          contents.map((content, index) => (
            <ContentCard
              key={content.content_id}
              content={content}
              index={index}
              onEdit={onEditContent}
              onDelete={handleDeleteContent}
              onAddBefore={onAddContent}
            />
          ))
        )}

        {/* Add button at the end */}
        {contents.length > 0 && (
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-blue-950 hover:bg-blue-50"
            onClick={() => onAddContent(null)}
          >
            <p className="text-gray-500">+ Agregar contenido al final</p>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-300 py-2 rounded-xl"
        >
          Atrás
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-blue-950 text-white py-2 rounded-xl"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ArticleFormPhase2;

