import React, { FC } from "react";
import { Content } from "../types";

interface ContentCardProps {
  content: Content;
  index: number;
  onEdit: (content: Content) => void;
  onDelete: (contentId: string) => void;
  onAddBefore: (position: number) => void;
}

const ContentCard: FC<ContentCardProps> = ({
  content,
  index,
  onEdit,
  onDelete,
  onAddBefore,
}) => {
  return (
    <>
      {/* Hover zone before content */}
      <div
        className="group relative h-4 -mb-2 z-10"
        onMouseEnter={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          if (rect.height < 20) {
            e.currentTarget.style.height = "40px";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.height = "16px";
        }}
      >
        <div className="hidden group-hover:flex items-center justify-center h-full bg-blue-100 border-2 border-dashed border-blue-300 rounded cursor-pointer">
          <button
            onClick={() => onAddBefore(index)}
            className="text-blue-950 font-semibold"
          >
            + Agregar contenido aquí
          </button>
        </div>
      </div>

      {/* Content card */}
      <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                {content.content_type}
              </span>
              <span className="text-xs text-gray-500">#{index + 1}</span>
            </div>
            <div className="text-sm text-gray-700">
              {content.content_type === "text_image" && (
                <p>Texto: {content.content_content.left.substring(0, 50)}...</p>
              )}
              {content.content_type === "image_text" && (
                <p>Imagen: {content.content_content.left}</p>
              )}
              {content.content_type === "just_image" && (
                <p>Imagen: {content.content_content.center}</p>
              )}
              {content.content_type === "just_text" && (
                <p>Texto: {content.content_content.center.substring(0, 50)}...</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(content)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(content.content_id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentCard;

