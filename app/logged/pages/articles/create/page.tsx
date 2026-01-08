"use client";

import React, { FC, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArticleService } from "@/app/service/ArticleService";
import { ContentService } from "@/app/service/ContentService";
import { Content, ArticleData, ArticleFormData } from "./types";
import { useArticleId } from "./hooks/useArticleId";
import ArticleHeader from "./components/ArticleHeader";
import ArticleFormPhase1 from "./components/ArticleFormPhase1";
import ArticleFormPhase2 from "./components/ArticleFormPhase2";
import ArticleFormPhase3 from "./components/ArticleFormPhase3";
import ContentModal from "./components/ContentModal";

const CreateArticle: FC = () => {
  const router = useRouter();
  const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3>(1);
  const { idArticle, isGeneratingId } = useArticleId();

  // Establecer fecha por defecto como hoy
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fase 1: Datos del artículo
  const [formData, setFormData] = useState<ArticleFormData>({
    idArticle: "",
    articleTitle: "",
    articleSubtitle: "",
    articleMainImageUrl: "https://source.unsplash.com/800x600/?nature",
    company: "",
    date: getTodayDate(),
    tags: "",
    tagsArray: [],
  });

  // Fase 2: Contenidos
  const [contents, setContents] = useState<Content[]>([]);
  const [showContentModal, setShowContentModal] = useState(false);
  const [contentModalPosition, setContentModalPosition] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<Content | null>(null);

  // Fase 3: Revisión
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Actualizar formData cuando el ID se genera
  useEffect(() => {
    if (idArticle) {
      setFormData((prev) => ({ ...prev, idArticle }));
    }
  }, [idArticle]);

  const handleFormDataChange = (data: Partial<ArticleFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handlePhase1Next = () => {
    if (formData.articleTitle && formData.date) {
      setCurrentPhase(2);
    }
  };

  const openContentModal = (position: number | null, content?: Content) => {
    setContentModalPosition(position);
    setEditingContent(content || null);
    setShowContentModal(true);
  };

  const closeContentModal = () => {
    setShowContentModal(false);
    setContentModalPosition(null);
    setEditingContent(null);
  };

  const handleContentConfirm = (newContent: Content, position: number | null) => {
    if (editingContent) {
      // Update existing content
      setContents(contents.map((c) => (c.content_id === editingContent!.content_id ? newContent : c)));
    } else {
      // Insert new content at position
      if (position === null) {
        setContents([...contents, newContent]);
      } else {
        const newContents = [...contents];
        newContents.splice(position, 0, newContent);
        setContents(newContents);
      }
    }
  };

  const handleDeleteContent = (contentId: string) => {
    setContents(contents.filter((c) => c.content_id !== contentId));
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
        id_article: formData.idArticle,
        articleTitle: formData.articleTitle,
        articleSubtitle: formData.articleSubtitle,
        article_main_image_url: formData.articleMainImageUrl,
        company: formData.company,
        date: formData.date,
        article_tags_array: formData.tagsArray,
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
      <ArticleHeader currentPhase={currentPhase} />

      <div className="flex flex-col p-8 max-w-4xl mx-auto w-full">
        {currentPhase === 1 && (
          <ArticleFormPhase1
            formData={formData}
            isGeneratingId={isGeneratingId}
            onFormDataChange={handleFormDataChange}
            onNext={handlePhase1Next}
          />
        )}

        {currentPhase === 2 && (
          <ArticleFormPhase2
            contents={contents}
            onAddContent={openContentModal}
            onEditContent={(content) => openContentModal(null, content)}
            onDeleteContent={handleDeleteContent}
            onBack={() => setCurrentPhase(1)}
            onNext={() => setCurrentPhase(3)}
          />
        )}

        {currentPhase === 3 && (
          <ArticleFormPhase3
            formData={formData}
            contents={contents}
            isSubmitting={isSubmitting}
            onBack={() => setCurrentPhase(2)}
            onSubmit={handleFinalSubmit}
          />
        )}

        <ContentModal
          isOpen={showContentModal}
          editingContent={editingContent}
          position={contentModalPosition}
          onClose={closeContentModal}
          onConfirm={handleContentConfirm}
        />
      </div>
    </div>
  );
};

export default CreateArticle;
