"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { articleInterface } from "@/app/contents/interfaces";
import { ArticleService } from "@/app/service/ArticleService";
import { ContentService } from "@/app/service/ContentService";
import EditContentsModal from "@/app/logged/logged_components/modals/EditContentsModal";
import DeleteArticleModal from "@/app/logged/logged_components/modals/DeleteArticleModal";
import ArticleHeader from "./id_article_components/ArticleHeader";
import ArticleMainImage from "./id_article_components/ArticleMainImage";
import ArticleTags from "./id_article_components/ArticleTags";
import ArticleContentsList from "./id_article_components/ArticleContentsList";

type EditTarget =
  | { kind: "articleTitle" }
  | { kind: "articleSubtitle" }
  | { kind: "articleMainImage" }
  | { kind: "company" }
  | { kind: "date" }
  | { kind: "tags" }
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
  const [currentEditTarget, setCurrentEditTarget] = useState<EditTarget | null>(null);

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
      article_tags_array: Array.isArray(raw?.article_tags_array) ? raw.article_tags_array : [],
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

        // Load contents
        if (article.contents_array && article.contents_array.length > 0) {
          try {
            const allContents = await ContentService.getAllContents();
            const articleContents = article.contents_array
              .map((contentId: string) => {
                return allContents.find((c: any) => c.content_id === contentId);
              })
              .filter((c: any) => c !== undefined);
            console.log("[IdArticlePage] Loaded contents:", articleContents);
            setContentsData(articleContents);
          } catch (contentError) {
            console.error("[IdArticlePage] Error loading contents:", contentError);
            setContentsData([]);
          }
        } else {
          setContentsData([]);
        }
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
      article_main_image_url: updates.article_main_image_url ?? articleData.article_main_image_url,
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
        const updateData = createArticleUpdateData({ article_main_image_url: newValue });
        await ArticleService.updateArticle(id_article, updateData);
        setArticleData({ ...articleData, article_main_image_url: newValue });
      } else if (currentEditTarget.kind === "company") {
        const updateData = createArticleUpdateData({ company: newValue });
        await ArticleService.updateArticle(id_article, updateData);
        setArticleData({ ...articleData, company: newValue });
      } else if (currentEditTarget.kind === "date") {
        const updateData = createArticleUpdateData({ date: newValue });
        await ArticleService.updateArticle(id_article, updateData);
        setArticleData({ ...articleData, date: newValue });
      } else if (currentEditTarget.kind === "tags") {
        // Parse tags from comma-separated string
        const tagsArray = newValue.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        const updateData = createArticleUpdateData({ article_tags_array: tagsArray });
        await ArticleService.updateArticle(id_article, updateData);
        setArticleData({ ...articleData, article_tags_array: tagsArray });
      } else if (currentEditTarget.kind === "content") {
        const updatedContents = contentsData.map((contentItem) => {
          if (contentItem.content_id !== currentEditTarget.contentId) {
            return contentItem;
          }
          return {
            ...contentItem,
            content_content: {
              ...contentItem.content_content,
              [currentEditTarget.field]: newValue
            }
          };
        });
        const contentToUpdate = updatedContents.find((c) => c.content_id === currentEditTarget.contentId);
        if (contentToUpdate) {
          await ContentService.updateContent(currentEditTarget.contentId, contentToUpdate);
        }
        setContentsData(updatedContents);
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
      "Edit main image URL"
    );
  };

  const handleEditCompany = () => {
    if (!articleData) return;
    openEditModal(
      { kind: "company" },
      articleData.company ?? "",
      "Edit company"
    );
  };

  const handleEditDate = () => {
    if (!articleData) return;
    openEditModal(
      { kind: "date" },
      articleData.date ?? "",
      "Edit date"
    );
  };

  const handleEditTags = () => {
    if (!articleData) return;
    const tagsString = articleData.article_tags_array?.join(", ") ?? "";
    openEditModal(
      { kind: "tags" },
      tagsString,
      "Edit tags (comma-separated)"
    );
  };

  const handleAddTag = () => {
    handleEditTags();
  };

  const handleRemoveTag = (tag: string) => {
    if (!articleData) return;
    const updatedTags = articleData.article_tags_array.filter(t => t !== tag);
    const updateData = createArticleUpdateData({ article_tags_array: updatedTags });
    ArticleService.updateArticle(id_article, updateData)
      .then(() => {
        setArticleData({ ...articleData, article_tags_array: updatedTags });
      })
      .catch((error: any) => {
        console.error("Error removing tag:", error);
        alert("Error al eliminar el tag");
      });
  };

  const handleEditContentField = (args: {
    contentId: string;
    field: "center" | "left" | "right";
    initialValue: string;
    modalTitle: string;
  }) => {
    openEditModal(
      { kind: "content", contentId: args.contentId, field: args.field },
      args.initialValue,
      args.modalTitle
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

  if (loading) {
    return (
      <main className="flex h-full min-h-screen flex-col items-center justify-center bg-white px-24 py-10 text-gray-600 w-full">
        <p className="text-lg">Cargando artículo...</p>
      </main>
    );
  }

  if (error || !articleData) {
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

        <ArticleHeader
          title={articleData.articleTitle}
          subtitle={articleData.articleSubtitle}
          onEditTitle={handleEditTitle}
          onEditSubtitle={handleEditSubtitle}
        />

        <ArticleMainImage
          imageUrl={articleData.article_main_image_url}
          onEditMainImage={handleEditMainImage}
        />

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex items-center gap-4">
            <span className="font-semibold">Compañía:</span>
            <span>{articleData.company || "Sin compañía"}</span>
            <button
              onClick={handleEditCompany}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Editar
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-semibold">Fecha:</span>
            <span>{articleData.date || "Sin fecha"}</span>
            <button
              onClick={handleEditDate}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Editar
            </button>
          </div>
        </div>

        <ArticleTags
          tags={articleData.article_tags_array || []}
          onRemoveTag={handleRemoveTag}
          onAddTag={handleAddTag}
        />

        <ArticleContentsList
          contentsIds={articleData.contents_array || []}
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

      <DeleteArticleModal
        isOpen={isDeleteModalOpen}
        articleTitle={articleData.articleTitle || "Sin título"}
        onConfirm={handleDeleteArticle}
        onCancel={closeDeleteModal}
      />
    </>
  );
}
