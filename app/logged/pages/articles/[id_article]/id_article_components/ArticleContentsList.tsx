"use client";

import React, { FC } from "react"; 
import ArticleContentCard from "./ArticleContentCard";
import ContentNotFound from "./ContentNotFound";
import ContentRenderer from "./ContentRenderer";

interface ArticleContentsListProps {
  contentsIds: string[];
  contentsData: any[];
  onEditContentField: (args: {
    contentId: string;
    field: "center" | "left" | "right";
    initialValue: string;
    modalTitle: string;
  }) => void;
}

const ArticleContentsList: FC<ArticleContentsListProps> = ({
  contentsIds,
  contentsData,
  onEditContentField,
}) => {
  const findContentDataById = (contentId: string) => {
    return contentsData.find(
      (contentItem: any) => contentItem.content_id === contentId
    );
  };

  const handleEditField = (args: {
    contentId: string;
    field: "center" | "left" | "right";
    value: string;
    isImage?: boolean;
  }) => {
    const { contentId, field, value, isImage } = args;

    const modalTitle = isImage ? "Edit image url" : "Edit contents";

    onEditContentField({
      contentId,
      field,
      initialValue: value ?? "",
      modalTitle,
    });
  };

  return (
    <section className="mt-8 flex flex-col gap-6">
      {contentsIds.map((contentId) => {
        const contentData = findContentDataById(contentId);

        if (!contentData) {
          return (
            <ArticleContentCard key={contentId}>
              <ContentNotFound contentId={contentId} />
            </ArticleContentCard>
          );
        }

        return (
          <ArticleContentCard key={contentId}>
            <ContentRenderer
              contentId={contentId}
              contentType={contentData.content_type}
              contentContent={contentData.content_content}
              onEditField={handleEditField}
            />
          </ArticleContentCard>
        );
      })}
    </section>
  );
};

export default ArticleContentsList;
