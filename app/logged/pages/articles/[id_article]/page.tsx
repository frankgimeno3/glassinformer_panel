"use client";

import { use, useEffect } from "react";

interface IdArticlePageProps {
  params: Promise<{
    id_article: string;
  }>;
}

export default function IdArticlePage({ params }: IdArticlePageProps) {
  const resolvedParams = use(params);
  const { id_article } = resolvedParams;

  useEffect(() => {
    console.log("PARAMS (resueltos):", resolvedParams);
    console.log("ID_ARTICLE:", id_article);
  }, [resolvedParams, id_article]);

  return (
    <main style={{ padding: "1rem" }}>
      <h1>Artículo dinámico</h1>
      <p>
        params.id_article: <strong>{id_article}</strong>
      </p>
    </main>
  );
}
