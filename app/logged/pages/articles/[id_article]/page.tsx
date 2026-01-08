"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { articleInterface } from "@/app/contents/interfaces";
import { ArticleService } from "@/app/service/ArticleService";
import { ContentService } from "@/app/service/ContentService";
import EditContentsModal from "@/app/logged/logged_components/modals/EditContentsModal";
import AddTagModal from "@/app/logged/logged_components/modals/AddTagModal";
import DeleteArticleModal from "@/app/logged/logged_components/modals/DeleteArticleModal";
import ArticleHeader from "./id_article_components/ArticleHeader";
import ArticleMainImage from "./id_article_components/ArticleMainImage";
import ArticleTags from "./id_article_components/ArticleTags";
import ArticleContentsList from "./id_article_components/ArticleContentsList";

type EditTarget =
  | { kind: "articleTitle" }
  | { kind: "articleSubtitle" }
  | { kind: "articleMainImage" }
  | { kind: "content"; contentId: string; field: "center" | "left" | "right" };

export default function IdArticlePage() {
  const params = useParams();
  const router = useRouter();
  const id_article = params?.id_article as string;

  const [articleData, setArticleData] = useState<articleInterface | null>(null);
  const [contentsData, setContentsData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [modalInitialValue, setModalInitialValue] = useState<string>("");
  const [modalTitle, setModalTitle] = useState<string>("Edit contents");
  const [currentEditTarget, setCurrentEditTarget] =
    useState<EditTarget | null>(null);

  const [isAddTagModalOpen, setIsAddTagModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
 
  const normalizeArticle = (raw: any): articleInterface => {
    return {
      id_article: String(raw?.id_article ?? ""),
      articleTitle: String(raw?.articleTitle ?? ""),
      articleSubtitle: String(raw?.articleSubtitle ?? ""),
      article_main_image_url: String(raw?.article_main_image_url ?? ""),
      company: String(raw?.company ?? ""),
      date: String(raw?.date ?? ""),
      article_tags_array: Array.isArray(raw?.article_tags_array)
        ? raw.article_tags_array
        : [],
      contents_array: Array.isArray(raw?.contents_array) ? raw.contents_array : [],
    };
  };

   useEffect(() => {
    const loadArticleData = async () => {
      console.log("[IdArticlePage] Starting to load article data, id_article:", id_article);
      setLoading(true);
      setError(null);

      try {
        console.log("[IdArticlePage] Calling ArticleService.getArticleById with:", id_article);
        const articleRaw = await ArticleService.getArticleById(id_article);
        console.log("[IdArticlePage] Raw article data received:", articleRaw);

        if (!articleRaw) {
          console.warn("[IdArticlePage] No article found for id:", id_article);
          setError("El artículo que buscas no existe.");
          setArticleData(null);
          return;
        }

        const article = normalizeArticle(articleRaw);
        console.log("[IdArticlePage] Normalized article:", article);
        setArticleData(article);

         const allContents = await ContentService.getAllContents();
         console.log("[IdArticlePage] All contents loaded:", allContents);

         const articleContents = allContents.filter((content: any) =>
          article.contents_array.includes(content.content_id)
        );
        console.log("[IdArticlePage] Filtered article contents:", articleContents);

        setContentsData(articleContents);
      } catch (err: any) {
        console.error("[IdArticlePage] Error loading article:", err);
        console.error("[IdArticlePage] Error details:", {
          message: err?.message,
          stack: err?.stack,
          response: err?.response,
          data: err?.data,
          status: err?.status
        });
        
        // Determinar el mensaje de error apropiado
        let errorMessage = "Error al cargar el artículo";
        if (err?.status === 500 || err?.status === 404) {
          errorMessage = "El artículo que buscas no existe o ha sido eliminado.";
        } else if (err?.message) {
          errorMessage = err.message;
        } else if (err?.data?.message) {
          errorMessage = err.data.message;
        }
        
        setError(errorMessage);
        setArticleData(null);
      } finally {
        console.log("[IdArticlePage] Setting loading to false");
        setLoading(false);
      }
    };

    if (id_article) {
      loadArticleData();
    } else {
      console.warn("[IdArticlePage] No id_article provided");
      setLoading(false);
      setError("ID de artículo no válido.");
      setArticleData(null);
    }
  }, [id_article]);

  const openEditModal = (
    editTarget: EditTarget,
    value: string,
    title: string = "Edit contents"
  ) => {
    setCurrentEditTarget(editTarget);
    setModalInitialValue(value);
    setModalTitle(title);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentEditTarget(null);
  };

   const createArticleUpdateData = (updates: Partial<articleInterface>) => {
    if (!articleData) {
      throw new Error("Article data not loaded");
    }
    return {
      articleTitle: updates.articleTitle ?? articleData.articleTitle,
      articleSubtitle: updates.articleSubtitle ?? articleData.articleSubtitle,
      article_main_image_url:
        updates.article_main_image_url ?? articleData.article_main_image_url,
      company: updates.company ?? articleData.company,
      date: updates.date ?? articleData.date,
      article_tags_array: updates.article_tags_array ?? articleData.article_tags_array,
      contents_array: updates.contents_array ?? articleData.contents_array,
    };
  };

  const handleSaveEditChanges = async (newValue: string) => {
    if (!currentEditTarget || !articleData) return;

    setIsSaving(true);
    try {
      if (currentEditTarget.kind === "articleTitle") {
        const updateData = createArticleUpdateData({ articleTitle: newValue });
        await ArticleService.updateArticle(id_article, updateData);
        setArticleData({ ...articleData, articleTitle: newValue });
      } else if (currentEditTarget.kind === "articleSubtitle") {
        const updateData = createArticleUpdateData({ articleSubtitle: newValue });
        await ArticleService.updateArticle(id_article, updateData);
        setArticleData({ ...articleData, articleSubtitle: newValue });
      } else if (currentEditTarget.kind === "articleMainImage") {
        const updateData = createArticleUpdateData({
          article_main_image_url: newValue,
        });
        await ArticleService.updateArticle(id_article, updateData);
        setArticleData({ ...articleData, article_main_image_url: newValue });
      } else if (currentEditTarget.kind === "content") {
        const contentToUpdate = contentsData.find(
          (c) => c.content_id === currentEditTarget.contentId
        );

        if (contentToUpdate) {
          const contentUpdateData = {
            content_type: contentToUpdate.content_type,
            content_content: {
              ...contentToUpdate.content_content,
              [currentEditTarget.field]: newValue,
            },
          };

          await ContentService.updateContent(
            currentEditTarget.contentId,
            contentUpdateData
          );

           const allContents = await ContentService.getAllContents();
          const articleContents = allContents.filter((content: any) =>
            (articleData.contents_array ?? []).includes(content.content_id)
          );
          setContentsData(articleContents);
        }
      }

      closeEditModal();
    } catch (error: any) {
      console.error("Error saving changes:", error);
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message
          ? error.message
          : error?.data?.message
          ? error.data.message
          : "Error desconocido";
      alert(`Error al guardar cambios: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const openAddTagModal = () => setIsAddTagModalOpen(true);
  const closeAddTagModal = () => setIsAddTagModalOpen(false);

  const handleSaveNewTag = async (newTag: string) => {
    const trimmedTag = newTag.trim();
    if (!trimmedTag || !articleData) {
      closeAddTagModal();
      return;
    }

    setIsSaving(true);
    try {
      const updateData = createArticleUpdateData({
        article_tags_array: [...(articleData.article_tags_array ?? []), trimmedTag],
      });
      await ArticleService.updateArticle(id_article, updateData);
      setArticleData({ ...articleData, article_tags_array: updateData.article_tags_array });
      closeAddTagModal();
    } catch (error: any) {
      console.error("Error adding tag:", error);
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message
          ? error.message
          : error?.data?.message
          ? error.data.message
          : "Error desconocido";
      alert(`Error al agregar tag: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    if (!articleData) return;

    setIsSaving(true);
    try {
      const updateData = createArticleUpdateData({
        article_tags_array: (articleData.article_tags_array ?? []).filter(
          (tag) => tag !== tagToRemove
        ),
      });
      await ArticleService.updateArticle(id_article, updateData);
      setArticleData({ ...articleData, article_tags_array: updateData.article_tags_array });
    } catch (error: any) {
      console.error("Error removing tag:", error);
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message
          ? error.message
          : error?.data?.message
          ? error.data.message
          : "Error desconocido";
      alert(`Error al eliminar tag: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditContentField = (args: {
    contentId: string;
    field: "center" | "left" | "right";
    initialValue: string;
    modalTitle: string;
  }) => {
    const { contentId, field, initialValue, modalTitle } = args;

    openEditModal(
      {
        kind: "content",
        contentId,
        field,
      },
      initialValue,
      modalTitle
    );
  };

  const handleEditTitle = () => {
    if (!articleData) return;
    openEditModal(
      { kind: "articleTitle" },
      articleData.articleTitle ?? "",
      "Edit article title"
    );
  };

  const handleEditSubtitle = () => {
    if (!articleData) return;
    openEditModal(
      { kind: "articleSubtitle" },
      articleData.articleSubtitle ?? "",
      "Edit article subtitle"
    );
  };

  const handleEditMainImage = () => {
    if (!articleData) return;
    openEditModal(
      { kind: "articleMainImage" },
      articleData.article_main_image_url ?? "",
      "Edit main image url"
    );
  };

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleDeleteArticle = async () => {
    setIsDeleting(true);
    try {
      await ArticleService.deleteArticle(id_article);
      router.push("/logged/pages/articles");
      router.refresh();
    } catch (error: any) {
      console.error("Error deleting article:", error);
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message
          ? error.message
          : error?.data?.message
          ? error.data.message
          : "Error desconocido";
      alert(`Error al eliminar el artículo: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Debug logs before render
  console.log("[IdArticlePage] Render - State:", {
    loading,
    error,
    articleData,
    articleDataType: typeof articleData,
    articleDataIsNull: articleData === null,
    articleDataIsUndefined: articleData === undefined,
    id_article
  });

   if (loading) {
    console.log("[IdArticlePage] Rendering loading state");
    return (
      <main className="flex h-full min-h-screen flex-col items-center justify-center bg-white px-24 py-10 text-gray-600 w-full">
        <p className="text-lg">Cargando artículo...</p>
      </main>
    );
  }

   if (error || !articleData) {
    console.log("[IdArticlePage] Rendering error state:", { error, articleData });
    return (
      <main className="flex h-full min-h-screen flex-col items-center justify-center bg-white px-24 py-10 text-gray-600 w-full">
        <p className="text-red-500 text-lg">
          {error || "El artículo que buscas no existe."}
        </p>
        <button
          onClick={() => router.push("/logged/pages/articles")}
          className="mt-4 px-4 py-2 bg-blue-950 text-white rounded-xl"
        >
          Volver a artículos
        </button>
      </main>
    );
  }

  console.log("[IdArticlePage] Rendering main content with articleData:", articleData);
  console.log("[IdArticlePage] About to render ArticleHeader with:", {
    title: articleData?.articleTitle,
    subtitle: articleData?.articleSubtitle,
    articleTitleExists: articleData?.articleTitle !== undefined,
    articleSubtitleExists: articleData?.articleSubtitle !== undefined
  });

  return (
    <>
      <main className="flex h-full min-h-screen flex-col gap-6 bg-white px-24 py-10 text-gray-600 w-full">
        <div className="flex justify-end mb-4">
          <button
            onClick={openDeleteModal}
            disabled={isDeleting}
            className={`px-4 py-2 rounded-xl text-white font-medium ${
              isDeleting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 cursor-pointer"
            }`}
          >
            {isDeleting ? "Eliminando..." : "Eliminar artículo"}
          </button>
        </div>
{/* 
        <ArticleHeader
          title={articleData?.articleTitle ?? ""}
          subtitle={articleData?.articleSubtitle ?? ""}
          onEditTitle={handleEditTitle}
          onEditSubtitle={handleEditSubtitle}
        /> */}

        <ArticleMainImage
          imageUrl={articleData?.article_main_image_url ?? ""}
          onEditMainImage={handleEditMainImage}
        />

        <ArticleTags
          tags={articleData?.article_tags_array ?? []}
          onRemoveTag={handleRemoveTag}
          onAddTag={openAddTagModal}
        />

        <ArticleContentsList
          contentsIds={articleData?.contents_array ?? []}
          contentsData={contentsData}
          onEditContentField={handleEditContentField}
        />
      </main>

      <EditContentsModal
        isOpen={isEditModalOpen}
        initialValue={modalInitialValue}
        title={modalTitle}
        onSave={handleSaveEditChanges}
        onCancel={closeEditModal}
      />

      <AddTagModal
        isOpen={isAddTagModalOpen}
        initialValue=""
        onSave={handleSaveNewTag}
        onCancel={closeAddTagModal}
      />

        <DeleteArticleModal
          isOpen={isDeleteModalOpen}
          articleTitle={articleData.articleTitle || "Sin título"}
          onConfirm={handleDeleteArticle}
          onCancel={closeDeleteModal}
        />
    </>
  );
}
