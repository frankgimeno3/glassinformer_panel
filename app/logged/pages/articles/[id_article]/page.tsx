"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import articles from "@/app/contents/articlesContents.json";
import contents from "@/app/contents/contentsContents.json";

import { articleInterface } from "@/app/contents/interfaces";
import EditContentsModal from "@/app/logged/logged_components/modals/EditContentsModal";
import AddTagModal from "@/app/logged/logged_components/modals/AddTagModal";
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
  const id_article = params?.id_article as string;

  const selectedArticle = articles.find(
    (article: articleInterface) => article.id_article === id_article
  );

  if (!selectedArticle) {
    return (
      <main style={{ padding: "1rem" }}>
        <p className="text-red-500">
          The article you are looking for does not exist.
        </p>
      </main>
    );
  }

  const [articleData, setArticleData] = useState<articleInterface>(
    selectedArticle
  );
  const [contentsData, setContentsData] = useState<any[]>(contents);

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [modalInitialValue, setModalInitialValue] = useState<string>("");
  const [modalTitle, setModalTitle] = useState<string>("Edit contents");
  const [currentEditTarget, setCurrentEditTarget] =
    useState<EditTarget | null>(null);

  const [isAddTagModalOpen, setIsAddTagModalOpen] = useState<boolean>(false);

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

  const handleSaveEditChanges = (newValue: string) => {
    if (!currentEditTarget) {
      return;
    }

    if (currentEditTarget.kind === "articleTitle") {
      setArticleData((previousArticleData) => ({
        ...previousArticleData,
        articleTitle: newValue,
      }));
    } else if (currentEditTarget.kind === "articleSubtitle") {
      setArticleData((previousArticleData) => ({
        ...previousArticleData,
        articleSubtitle: newValue,
      }));
    } else if (currentEditTarget.kind === "articleMainImage") {
      setArticleData((previousArticleData) => ({
        ...previousArticleData,
        article_main_image_url: newValue,
      }));
    } else if (currentEditTarget.kind === "content") {
      setContentsData((previousContentsData: any[]) =>
        previousContentsData.map((contentItem) => {
          if (contentItem.content_id !== currentEditTarget.contentId) {
            return contentItem;
          }

          return {
            ...contentItem,
            content_content: {
              ...contentItem.content_content,
              [currentEditTarget.field]: newValue,
            },
          };
        })
      );
    }

    closeEditModal();
  };

  const openAddTagModal = () => {
    setIsAddTagModalOpen(true);
  };

  const closeAddTagModal = () => {
    setIsAddTagModalOpen(false);
  };

  const handleSaveNewTag = (newTag: string) => {
    const trimmedTag = newTag.trim();
    if (!trimmedTag) {
      closeAddTagModal();
      return;
    }

    setArticleData((previousArticleData) => ({
      ...previousArticleData,
      article_tags_array: [
        ...previousArticleData.article_tags_array,
        trimmedTag,
      ],
    }));

    closeAddTagModal();
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setArticleData((previousArticleData) => ({
      ...previousArticleData,
      article_tags_array: previousArticleData.article_tags_array.filter(
        (tag) => tag !== tagToRemove
      ),
    }));
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
    openEditModal(
      { kind: "articleTitle" },
      articleData.articleTitle,
      "Edit article title"
    );
  };

  const handleEditSubtitle = () => {
    openEditModal(
      { kind: "articleSubtitle" },
      articleData.articleSubtitle,
      "Edit article subtitle"
    );
  };

  const handleEditMainImage = () => {
    openEditModal(
      { kind: "articleMainImage" },
      articleData.article_main_image_url,
      "Edit main image url"
    );
  };

  return (
    <>
      <main className="flex h-full min-h-screen flex-col gap-6 bg-white px-24 py-10 text-gray-600 w-full">
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

        <ArticleTags
          tags={articleData.article_tags_array}
          onRemoveTag={handleRemoveTag}
          onAddTag={openAddTagModal}
        />

        <ArticleContentsList
          contentsIds={articleData.contents_array}
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
    </>
  );
}
