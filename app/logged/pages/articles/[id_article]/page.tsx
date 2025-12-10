"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";

import articles from "@/app/contents/articlesContents.json";
import contents from "@/app/contents/contentsContents.json";

import { articleInterface } from "@/app/contents/interfaces";

export default function IdArticlePage() {
  const router = useRouter();
  const params = useParams(); // 🔹 sin genérico
  const id_article = params?.id_article as string; // 🔹 casteamos

  useEffect(() => {
    console.log("ID_ARTICLE (desde params):", id_article);
  }, [id_article]);

  const selectedArticle = articles.find(
    (a: articleInterface) => a.id_article === id_article
  );

  if (!selectedArticle) {
    return (
      <main style={{ padding: "1rem" }}>
        <p className="text-red-500">
          The article you are looking for doesn't exist.
        </p>
      </main>
    );
  }

  const renderContent = (contentId: string) => {
    const contentData = contents.find((c) => c.content_id === contentId);

    if (!contentData) {
      return (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          ❌ Content not found: {contentId}
        </div>
      );
    }

    const { content_type, content_content } = contentData;

    if (content_type === "just_text") {
      return (
        <div className="w-full flex justify-center">
          <p className="text-center max-w-2xl">{content_content.center}</p>
        </div>
      );
    }

    if (content_type === "just_image") {
      return (
        <div className="w-full flex justify-center">
          <img
            src={content_content.center}
            alt="content image"
            className="max-w-md w-full"
          />
        </div>
      );
    }

    if (content_type === "text_image") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <p>{content_content.left}</p>
          <img
            src={content_content.right}
            alt="content image"
            className="w-full rounded-md"
          />
        </div>
      );
    }

    if (content_type === "image_text") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <img
            src={content_content.left}
            alt="content image"
            className="w-full rounded-md"
          />
          <p>{content_content.right}</p>
        </div>
      );
    }

    return (
      <div className="p-4 bg-yellow-100 text-yellow-700 rounded-md">
        ⚠ Unknown content type: {content_type}
      </div>
    );
  };

  return (
    <main className="flex flex-col h-full min-h-screen text-gray-600 px-24 py-10 gap-6 bg-white">
      <h1 className="text-4xl font-bold">{selectedArticle.articleTitle}</h1>
      <h2 className="text-xl text-gray-500">
        {selectedArticle.articleSubtitle}
      </h2>

      <img
        src={selectedArticle.article_main_image_url}
        alt="Article main image"
        className="w-full rounded-lg shadow-md text-xs text-right min-h-50" 
      />

      <div className="flex flex-wrap gap-2 mt-4">
        {selectedArticle.article_tags_array.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-gray-200 rounded-full text-sm cursor-pointer hover:bg-gray-200/50"
            onClick={() => {
              router.push(`/search/tags=${tag}`);
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-6">
        {selectedArticle.contents_array.map((contentId) => (
          <div
            key={contentId}
            className="p-6 bg-gray-100 rounded-md shadow flex flex-col gap-4"
          >
            {renderContent(contentId)}
          </div>
        ))}
      </div>
    </main>
  );
}
