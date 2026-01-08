import React, { FC, useState, useEffect } from "react";
import { Content } from "../types";

interface ContentModalProps {
  isOpen: boolean;
  editingContent: Content | null;
  position: number | null;
  onClose: () => void;
  onConfirm: (content: Content, position: number | null) => void;
}

const ContentModal: FC<ContentModalProps> = ({
  isOpen,
  editingContent,
  
  position,
  onClose,
  onConfirm,
}) => {
  const [selectedContentType, setSelectedContentType] = useState<Content["content_type"] | "">("");
  const [contentFormData, setContentFormData] = useState({
    left: "",
    right: "",
    center: "",
  });

  useEffect(() => {
    if (editingContent) {
      setSelectedContentType(editingContent.content_type);
      setContentFormData(editingContent.content_content);
    } else {
      setSelectedContentType("");
      setContentFormData({ left: "", right: "", center: "" });
    }
  }, [editingContent, isOpen]);

  const generateContentId = () => {
    return `id_content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleContentTypeSelect = (type: Content["content_type"]) => {
    setSelectedContentType(type);
    if (type === "text_image") {
      setContentFormData({ left: "", right: "", center: "no" });
    } else if (type === "image_text") {
      setContentFormData({ left: "", right: "", center: "no" });
    } else if (type === "just_image") {
      setContentFormData({ left: "no", right: "no", center: "" });
    } else if (type === "just_text") {
      setContentFormData({ left: "no", right: "no", center: "" });
    }
  };

  const handleConfirm = () => {
    if (!selectedContentType) return;

    let isValid = false;
    if (selectedContentType === "text_image") {
      isValid = contentFormData.left.trim() !== "" && contentFormData.right.trim() !== "";
    } else if (selectedContentType === "image_text") {
      isValid = contentFormData.left.trim() !== "" && contentFormData.right.trim() !== "";
    } else if (selectedContentType === "just_image") {
      isValid = contentFormData.center.trim() !== "";
    } else if (selectedContentType === "just_text") {
      isValid = contentFormData.center.trim() !== "";
    }

    if (!isValid) {
      alert("Por favor, complete todos los campos requeridos");
      return;
    }

    const newContent: Content = {
      content_id: editingContent?.content_id || generateContentId(),
      content_type: selectedContentType,
      content_content: { ...contentFormData },
    };

    onConfirm(newContent, position);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col p-6 bg-white shadow-xl rounded-xl gap-6 text-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b">
          <h2 className="text-xl font-bold">
            {editingContent ? "Editar Contenido" : "Nuevo Contenido"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {!selectedContentType ? (
          <div className="flex flex-col gap-3">
            <p className="font-bold">Seleccione el tipo de contenido:</p>
            <div className="grid grid-cols-2 gap-3">
              {(["text_image", "image_text", "just_image", "just_text"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => handleContentTypeSelect(type)}
                  className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-950 hover:bg-blue-50 text-left"
                >
                  <p className="font-semibold">{type.replace("_", " ").toUpperCase()}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {type === "text_image" && "Texto a la izquierda, imagen a la derecha"}
                    {type === "image_text" && "Imagen a la izquierda, texto a la derecha"}
                    {type === "just_image" && "Solo imagen centrada"}
                    {type === "just_text" && "Solo texto centrado"}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="font-bold">Tipo: {selectedContentType}</p>
              <button
                onClick={() => setSelectedContentType("")}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Cambiar tipo
              </button>
            </div>

            {(selectedContentType === "text_image" || selectedContentType === "image_text") && (
              <>
                <div className="space-y-2">
                  <label className="font-bold">
                    {selectedContentType === "text_image" ? "Texto (izquierda)" : "Imagen (izquierda)"} *
                  </label>
                  {selectedContentType === "text_image" ? (
                    <textarea
                      value={contentFormData.left}
                      onChange={(e) => setContentFormData({ ...contentFormData, left: e.target.value })}
                      className="w-full px-4 py-2 border rounded-xl min-h-[100px]"
                      placeholder="Ingrese el texto..."
                    />
                  ) : (
                    <input
                      type="text"
                      value={contentFormData.left}
                      onChange={(e) => setContentFormData({ ...contentFormData, left: e.target.value })}
                      className="w-full px-4 py-2 border rounded-xl"
                      placeholder="URL de la imagen..."
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <label className="font-bold">
                    {selectedContentType === "text_image" ? "Imagen (derecha)" : "Texto (derecha)"} *
                  </label>
                  {selectedContentType === "text_image" ? (
                    <input
                      type="text"
                      value={contentFormData.right}
                      onChange={(e) => setContentFormData({ ...contentFormData, right: e.target.value })}
                      className="w-full px-4 py-2 border rounded-xl"
                      placeholder="URL de la imagen..."
                    />
                  ) : (
                    <textarea
                      value={contentFormData.right}
                      onChange={(e) => setContentFormData({ ...contentFormData, right: e.target.value })}
                      className="w-full px-4 py-2 border rounded-xl min-h-[100px]"
                      placeholder="Ingrese el texto..."
                    />
                  )}
                </div>
              </>
            )}

            {(selectedContentType === "just_image" || selectedContentType === "just_text") && (
              <div className="space-y-2">
                <label className="font-bold">
                  {selectedContentType === "just_image" ? "Imagen (centrada)" : "Texto (centrado)"} *
                </label>
                {selectedContentType === "just_image" ? (
                  <input
                    type="text"
                    value={contentFormData.center}
                    onChange={(e) => setContentFormData({ ...contentFormData, center: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl"
                    placeholder="URL de la imagen..."
                  />
                ) : (
                  <textarea
                    value={contentFormData.center}
                    onChange={(e) => setContentFormData({ ...contentFormData, center: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl min-h-[150px]"
                    placeholder="Ingrese el texto..."
                  />
                )}
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-300 py-2 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 bg-blue-950 text-white py-2 rounded-xl"
              >
                Confirmar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentModal;

