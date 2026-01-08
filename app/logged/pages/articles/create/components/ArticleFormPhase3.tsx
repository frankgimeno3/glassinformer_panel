import React, { FC } from "react";
import { Content, ArticleFormData } from "../types";

interface ArticleFormPhase3Props {
  formData: ArticleFormData;
  contents: Content[];
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
}

const ArticleFormPhase3: FC<ArticleFormPhase3Props> = ({
  formData,
  contents,
  isSubmitting,
  onBack,
  onSubmit,
}) => {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">Revisión Final</h2>

      <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
        <h3 className="font-bold text-lg mb-4">Datos del Artículo</h3>
        <div className="space-y-2 text-sm">
          <p><strong>ID:</strong> {formData.idArticle}</p>
          <p><strong>Título:</strong> {formData.articleTitle}</p>
          <p><strong>Subtítulo:</strong> {formData.articleSubtitle || "N/A"}</p>
          <p><strong>Compañía:</strong> {formData.company || "N/A"}</p>
          <p><strong>Fecha:</strong> {formData.date}</p>
          <p><strong>Tags:</strong> {formData.tagsArray.length > 0 ? formData.tagsArray.join(", ") : "Ninguno"}</p>
          {formData.articleMainImageUrl && (
            <div className="mt-4">
              <p className="font-semibold mb-2">Imagen Principal:</p>
              <img
                src={formData.articleMainImageUrl}
                alt="Article main image"
                className="w-full max-w-md rounded-lg shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://source.unsplash.com/800x600/?nature";
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
        <h3 className="font-bold text-lg mb-4">Contenidos ({contents.length})</h3>
        <div className="space-y-6">
          {contents.map((content, index) => (
            <div key={content.content_id} className="border-l-4 border-blue-500 pl-4 py-2">
              <p className="font-semibold text-sm mb-2">
                {index + 1}. {content.content_type}
              </p>
              
              {content.content_type === "just_text" && (
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm">{content.content_content.center}</p>
                </div>
              )}
              
              {content.content_type === "just_image" && (
                <div className="bg-white p-3 rounded border">
                  <img
                    src={content.content_content.center}
                    alt="Content image"
                    className="w-full max-w-md rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://source.unsplash.com/800x600/?nature";
                    }}
                  />
                </div>
              )}
              
              {content.content_type === "text_image" && (
                <div className="bg-white p-3 rounded border grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Texto (izquierda):</p>
                    <p className="text-sm">{content.content_content.left}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Imagen (derecha):</p>
                    <img
                      src={content.content_content.right}
                      alt="Content image"
                      className="w-full rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://source.unsplash.com/800x600/?nature";
                      }}
                    />
                  </div>
                </div>
              )}
              
              {content.content_type === "image_text" && (
                <div className="bg-white p-3 rounded border grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Imagen (izquierda):</p>
                    <img
                      src={content.content_content.left}
                      alt="Content image"
                      className="w-full rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://source.unsplash.com/800x600/?nature";
                      }}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Texto (derecha):</p>
                    <p className="text-sm">{content.content_content.right}</p>
                  </div>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-2">ID: {content.content_id}</p>
            </div>
          ))}
          {contents.length === 0 && (
            <p className="text-gray-500 text-sm">No hay contenidos agregados</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 bg-gray-300 py-2 rounded-xl"
        >
          Atrás
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`flex-1 py-2 rounded-xl ${
            isSubmitting
              ? "bg-gray-400 text-gray-600"
              : "bg-blue-950 text-white"
          }`}
        >
          {isSubmitting ? "Creando..." : "Finalizar y Crear Artículo"}
        </button>
      </div>
    </div>
  );
};

export default ArticleFormPhase3;

