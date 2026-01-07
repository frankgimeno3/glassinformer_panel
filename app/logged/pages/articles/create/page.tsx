"use client";

import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { ArticleService } from "@/app/service/ArticleService";
import { ContentService } from "@/app/service/ContentService";

interface Content {
  content_id: string;
  content_type: "text_image" | "image_text" | "just_image" | "just_text";
  content_content: {
    left: string;
    right: string;
    center: string;
  };
}

interface ArticleData {
  id_article: string;
  articleTitle: string;
  articleSubtitle: string;
  article_main_image_url: string;
  company: string;
  date: string;
  article_tags_array: string[];
  contents_array: string[];
}

const CreateArticle: FC = () => {
  const router = useRouter();
  const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3>(1);

  // Fase 1: Datos del artículo
  const [idArticle, setIdArticle] = useState("");
  const [articleTitle, setArticleTitle] = useState("");
  const [articleSubtitle, setArticleSubtitle] = useState("");
  const [articleMainImageUrl, setArticleMainImageUrl] = useState("");
  const [company, setCompany] = useState("");
  const [date, setDate] = useState("");
  const [tags, setTags] = useState("");
  const [tagsArray, setTagsArray] = useState<string[]>([]);

  // Fase 2: Contenidos
  const [contents, setContents] = useState<Content[]>([]);
  const [showContentModal, setShowContentModal] = useState(false);
  const [contentModalPosition, setContentModalPosition] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [selectedContentType, setSelectedContentType] = useState<Content["content_type"] | "">("");
  const [contentFormData, setContentFormData] = useState({
    left: "",
    right: "",
    center: "",
  });

  // Fase 3: Revisión
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTag = () => {
    if (tags.trim()) {
      setTagsArray([...tagsArray, tags.trim()]);
      setTags("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setTagsArray(tagsArray.filter((_, i) => i !== index));
  };

  const handlePhase1Next = () => {
    if (idArticle && articleTitle && date) {
      setCurrentPhase(2);
    }
  };

  const openContentModal = (position: number | null, content?: Content) => {
    setContentModalPosition(position);
    if (content) {
      setEditingContent(content);
      setSelectedContentType(content.content_type);
      setContentFormData(content.content_content);
    } else {
      setEditingContent(null);
      setSelectedContentType("");
      setContentFormData({ left: "", right: "", center: "" });
    }
    setShowContentModal(true);
  };

  const closeContentModal = () => {
    setShowContentModal(false);
    setContentModalPosition(null);
    setEditingContent(null);
    setSelectedContentType("");
    setContentFormData({ left: "", right: "", center: "" });
  };

  const generateContentId = () => {
    return `id_content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleContentTypeSelect = (type: Content["content_type"]) => {
    setSelectedContentType(type);
    // Reset form based on type
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

  const handleContentConfirm = () => {
    if (!selectedContentType) return;

    // Validate based on content type
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

    if (editingContent) {
      // Update existing content
      setContents(contents.map((c) => (c.content_id === editingContent.content_id ? newContent : c)));
    } else {
      // Insert new content at position
      if (contentModalPosition === null) {
        setContents([...contents, newContent]);
      } else {
        const newContents = [...contents];
        newContents.splice(contentModalPosition, 0, newContent);
        setContents(newContents);
      }
    }

    closeContentModal();
  };

  const handleDeleteContent = (contentId: string) => {
    if (confirm("¿Está seguro de eliminar este contenido?")) {
      setContents(contents.filter((c) => c.content_id !== contentId));
    }
  };

  const handlePhase2Next = () => {
    setCurrentPhase(3);
  };

  const handlePhase2Back = () => {
    setCurrentPhase(1);
  };

  const handlePhase3Back = () => {
    setCurrentPhase(2);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Create all contents first (only if there are contents)
      const contentIds: string[] = [];
      if (contents.length > 0) {
        for (const content of contents) {
          try {
            console.log("Creating content:", JSON.stringify(content, null, 2));
            const response = await ContentService.createContent(content);
            console.log("Content created successfully:", response);
            contentIds.push(content.content_id);
          } catch (contentError: any) {
            console.error("Error creating content - full error:", contentError);
            // Extract error message properly
            let errorMessage = "Error desconocido";
            if (typeof contentError === "string") {
              errorMessage = contentError;
            } else if (contentError?.message) {
              errorMessage = contentError.message;
            } else if (contentError?.data?.message) {
              errorMessage = contentError.data.message;
            } else if (contentError?.status) {
              errorMessage = `Error ${contentError.status}: ${contentError.message || "Error del servidor"}`;
            } else if (contentError?.data) {
              errorMessage = typeof contentError.data === "string" 
                ? contentError.data 
                : JSON.stringify(contentError.data);
            } else {
              errorMessage = JSON.stringify(contentError);
            }
            throw new Error(`Error al crear contenido: ${errorMessage}`);
          }
        }
      }

      // Create article with content IDs
      const articleData: ArticleData = {
        id_article: idArticle,
        articleTitle,
        articleSubtitle,
        article_main_image_url: articleMainImageUrl,
        company,
        date,
        article_tags_array: tagsArray,
        contents_array: contentIds,
      };

      console.log("Creating article:", JSON.stringify(articleData, null, 2));
      const articleResponse = await ArticleService.createArticle(articleData);
      console.log("Article created successfully:", articleResponse);

      alert("¡Artículo creado exitosamente!");
      router.push("/logged/pages/articles");
      router.refresh();
    } catch (error: any) {
      console.error("Error creating article - full error:", error);
      // Extract error message properly
      let errorMessage = "Error desconocido";
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.status) {
        errorMessage = `Error ${error.status}: ${error.message || "Error del servidor"}`;
      } else if (error?.data) {
        errorMessage = typeof error.data === "string" 
          ? error.data 
          : JSON.stringify(error.data);
      } else {
        errorMessage = JSON.stringify(error);
      }
      alert(`Error al crear el artículo: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-white min-h-screen">
      <div className="flex flex-col text-center bg-blue-950/70 p-5 px-46 text-white">
        <p className="text-2xl">Crear Nuevo Artículo</p>
        <p className="text-sm mt-2">Fase {currentPhase} de 3</p>
      </div>

      <div className="flex flex-col p-8 max-w-4xl mx-auto w-full">
        {/* FASE 1: Datos del Artículo */}
        {currentPhase === 1 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold">Datos del Artículo</h2>

            <div className="space-y-2">
              <label className="font-bold text-lg">ID del Artículo *</label>
              <input
                type="text"
                value={idArticle}
                onChange={(e) => setIdArticle(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl"
                placeholder="article_25_000000001"
              />
            </div>

            <div className="space-y-2">
              <label className="font-bold text-lg">Título del Artículo *</label>
              <input
                type="text"
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl"
                placeholder="Article Title"
              />
            </div>

            <div className="space-y-2">
              <label className="font-bold text-lg">Subtítulo del Artículo</label>
              <input
                type="text"
                value={articleSubtitle}
                onChange={(e) => setArticleSubtitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl"
                placeholder="Article Subtitle"
              />
            </div>

            <div className="space-y-2">
              <label className="font-bold text-lg">URL de Imagen Principal</label>
              <input
                type="text"
                value={articleMainImageUrl}
                onChange={(e) => setArticleMainImageUrl(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl"
                placeholder="image url"
              />
            </div>

            <div className="space-y-2">
              <label className="font-bold text-lg">Compañía</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl"
                placeholder="Company"
              />
            </div>

            <div className="space-y-2">
              <label className="font-bold text-lg">Fecha *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label className="font-bold text-lg">Tags</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                  className="flex-1 px-4 py-2 border rounded-xl"
                  placeholder="Escriba un tag y presione Enter"
                />
                <button
                  onClick={handleAddTag}
                  className="bg-blue-950 text-white px-4 py-2 rounded-xl"
                >
                  Agregar
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {tagsArray.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(index)}
                      className="text-blue-800 hover:text-blue-950"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => router.push("/logged/pages/articles")}
                className="flex-1 bg-gray-300 py-2 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handlePhase1Next}
                disabled={!idArticle || !articleTitle || !date}
                className={`flex-1 py-2 rounded-xl ${
                  idArticle && articleTitle && date
                    ? "bg-blue-950 text-white"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* FASE 2: Creador de Contenidos */}
        {currentPhase === 2 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold">Contenidos del Artículo</h2>
            <p className="text-sm text-gray-600">
              Pase el mouse entre los contenidos para agregar uno nuevo. Haga clic en un contenido para editarlo.
            </p>

            <div className="flex flex-col gap-4">
              {contents.length === 0 ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-950 hover:bg-blue-50"
                  onClick={() => openContentModal(null)}
                >
                  <p className="text-gray-500">Haga clic para agregar el primer contenido</p>
                </div>
              ) : (
                contents.map((content, index) => (
                  <React.Fragment key={content.content_id}>
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
                          onClick={() => openContentModal(index)}
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
                            onClick={() => openContentModal(null, content)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteContent(content.content_id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ))
              )}

              {/* Add button at the end */}
              {contents.length > 0 && (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-blue-950 hover:bg-blue-50"
                  onClick={() => openContentModal(null)}
                >
                  <p className="text-gray-500">+ Agregar contenido al final</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handlePhase2Back}
                className="flex-1 bg-gray-300 py-2 rounded-xl"
              >
                Atrás
              </button>
              <button
                onClick={handlePhase2Next}
                className="flex-1 bg-blue-950 text-white py-2 rounded-xl"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* FASE 3: Revisión Final */}
        {currentPhase === 3 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold">Revisión Final</h2>

            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
              <h3 className="font-bold text-lg mb-4">Datos del Artículo</h3>
              <div className="space-y-2 text-sm">
                <p><strong>ID:</strong> {idArticle}</p>
                <p><strong>Título:</strong> {articleTitle}</p>
                <p><strong>Subtítulo:</strong> {articleSubtitle || "N/A"}</p>
                <p><strong>Compañía:</strong> {company || "N/A"}</p>
                <p><strong>Fecha:</strong> {date}</p>
                <p><strong>Tags:</strong> {tagsArray.length > 0 ? tagsArray.join(", ") : "Ninguno"}</p>
                <p><strong>URL Imagen:</strong> {articleMainImageUrl || "N/A"}</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
              <h3 className="font-bold text-lg mb-4">Contenidos ({contents.length})</h3>
              <div className="space-y-3">
                {contents.map((content, index) => (
                  <div key={content.content_id} className="border-l-4 border-blue-500 pl-4">
                    <p className="font-semibold text-sm">
                      {index + 1}. {content.content_type}
                    </p>
                    <p className="text-xs text-gray-600">ID: {content.content_id}</p>
                  </div>
                ))}
                {contents.length === 0 && (
                  <p className="text-gray-500 text-sm">No hay contenidos agregados</p>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handlePhase3Back}
                disabled={isSubmitting}
                className="flex-1 bg-gray-300 py-2 rounded-xl"
              >
                Atrás
              </button>
              <button
                onClick={handleFinalSubmit}
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
        )}

        {/* Modal de Creación/Edición de Contenido */}
        {showContentModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={closeContentModal}
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
                  onClick={closeContentModal}
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
                      onClick={closeContentModal}
                      className="flex-1 bg-gray-300 py-2 rounded-xl"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleContentConfirm}
                      className="flex-1 bg-blue-950 text-white py-2 rounded-xl"
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateArticle;
