import { useState, useEffect } from "react";
import { ArticleService } from "@/app/service/ArticleService";

export const useArticleId = () => {
  const [idArticle, setIdArticle] = useState("");
  const [isGeneratingId, setIsGeneratingId] = useState(true);

  const generateArticleId = async (): Promise<string> => {
    try {
      const allArticles = await ArticleService.getAllArticles();
      
      if (!Array.isArray(allArticles)) {
        console.warn("getAllArticles no devolvió un array, usando array vacío");
        const currentYear = new Date().getFullYear();
        const yearSuffix = currentYear.toString().slice(-2);
        return `article_${yearSuffix}_000000001`;
      }
      
      const currentYear = new Date().getFullYear();
      const yearSuffix = currentYear.toString().slice(-2);
      const pattern = new RegExp(`^article_${yearSuffix}_\\d{9}$`);
      
      const currentYearArticles = allArticles.filter((article: any) => {
        if (!article || !article.id_article) return false;
        return pattern.test(String(article.id_article));
      });
      
      let maxOrdinal = 0;
      currentYearArticles.forEach((article: any) => {
        const match = String(article.id_article).match(/^article_\d{2}_(\d{9})$/);
        if (match) {
          const ordinal = parseInt(match[1], 10);
          if (ordinal > maxOrdinal) {
            maxOrdinal = ordinal;
          }
        }
      });
      
      const nextOrdinal = maxOrdinal + 1;
      const ordinalString = nextOrdinal.toString().padStart(9, '0');
      const generatedId = `article_${yearSuffix}_${ordinalString}`;
      console.log("Generated ID in function:", generatedId);
      return generatedId;
    } catch (error) {
      console.error("Error generating article ID:", error);
      const currentYear = new Date().getFullYear();
      const yearSuffix = currentYear.toString().slice(-2);
      return `article_${yearSuffix}_000000001`;
    }
  };

  useEffect(() => {
    const loadArticleId = async () => {
      setIsGeneratingId(true);
      try {
        const generatedId = await generateArticleId();
        console.log("Generated Article ID:", generatedId);
        if (generatedId && generatedId.trim() !== "") {
          setIdArticle(generatedId);
        } else {
          const currentYear = new Date().getFullYear();
          const yearSuffix = currentYear.toString().slice(-2);
          const fallbackId = `article_${yearSuffix}_000000001`;
          console.log("Using fallback ID:", fallbackId);
          setIdArticle(fallbackId);
        }
      } catch (error) {
        console.error("Error loading article ID:", error);
        const currentYear = new Date().getFullYear();
        const yearSuffix = currentYear.toString().slice(-2);
        const fallbackId = `article_${yearSuffix}_000000001`;
        console.log("Using error fallback ID:", fallbackId);
        setIdArticle(fallbackId);
      } finally {
        setIsGeneratingId(false);
      }
    };
    
    loadArticleId();
  }, []);

  return { idArticle, isGeneratingId };
};

