import React, { FC } from "react";
import { useRouter } from "next/navigation";
import { ArticleFormData } from "../types";

interface ArticleFormPhase1Props {
  formData: ArticleFormData;
  isGeneratingId: boolean;
  onFormDataChange: (data: Partial<ArticleFormData>) => void;
  onNext: () => void;
}

const ArticleFormPhase1: FC<ArticleFormPhase1Props> = ({
  formData,
  isGeneratingId,
  onFormDataChange,
  onNext,
}) => {
  const router = useRouter();

  const handleAddTag = () => {
    if (formData.tags.trim()) {
      onFormDataChange({
        tagsArray: [...formData.tagsArray, formData.tags.trim()],
        tags: "",
      });
    }
  };

  const handleRemoveTag = (index: number) => {
    onFormDataChange({
      tagsArray: formData.tagsArray.filter((_, i) => i !== index),
    });
  };

  const handlePhase1Next = () => {
    if (formData.articleTitle && formData.date) {
      onNext();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">Datos del Artículo</h2>

      <div className="space-y-2">
        <label className="font-bold text-lg">ID del Artículo *</label>
        <input
          type="text"
          value={isGeneratingId ? "Generando..." : (formData.idArticle || "")}
          readOnly={true}
          disabled={true}
          onChange={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onKeyDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onPaste={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onInput={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="w-full px-4 py-2 border rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
          tabIndex={-1}
          autoComplete="off"
          spellCheck={false}
          style={{ userSelect: 'none' }}
        />
        {isGeneratingId && (
          <p className="text-sm text-gray-500">Generando ID automáticamente...</p>
        )}
        {!isGeneratingId && formData.idArticle && (
          <p className="text-xs text-gray-500">ID generado automáticamente - No editable</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="font-bold text-lg">Título del Artículo *</label>
        <input
          type="text"
          value={formData.articleTitle}
          onChange={(e) => onFormDataChange({ articleTitle: e.target.value })}
          className="w-full px-4 py-2 border rounded-xl"
          placeholder="Article Title"
        />
      </div>

      <div className="space-y-2">
        <label className="font-bold text-lg">Subtítulo del Artículo</label>
        <input
          type="text"
          value={formData.articleSubtitle}
          onChange={(e) => onFormDataChange({ articleSubtitle: e.target.value })}
          className="w-full px-4 py-2 border rounded-xl"
          placeholder="Article Subtitle"
        />
      </div>

      <div className="space-y-2">
        <label className="font-bold text-lg">URL de Imagen Principal</label>
        <input
          type="text"
          value={formData.articleMainImageUrl}
          onChange={(e) => onFormDataChange({ articleMainImageUrl: e.target.value })}
          className="w-full px-4 py-2 border rounded-xl"
          placeholder="image url"
        />
      </div>

      <div className="space-y-2">
        <label className="font-bold text-lg">Compañía</label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => onFormDataChange({ company: e.target.value })}
          className="w-full px-4 py-2 border rounded-xl"
          placeholder="Company"
        />
      </div>

      <div className="space-y-2">
        <label className="font-bold text-lg">Fecha *</label>
        <input
          type="date"
          value={formData.date}
          readOnly={true}
          disabled={true}
          onChange={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onKeyDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onPaste={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onInput={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="w-full px-4 py-2 border rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
          tabIndex={-1}
          autoComplete="off"
          style={{ userSelect: 'none' }}
        />
        <p className="text-xs text-gray-500">Fecha establecida automáticamente - No editable</p>
      </div>

      <div className="space-y-2">
        <label className="font-bold text-lg">Tags</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => onFormDataChange({ tags: e.target.value })}
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
          {formData.tagsArray.map((tag, index) => (
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
          disabled={isGeneratingId || !formData.articleTitle || !formData.date}
          className={`flex-1 py-2 rounded-xl ${
            !isGeneratingId && formData.articleTitle && formData.date
              ? "bg-blue-950 text-white"
              : "bg-gray-300 text-gray-500"
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ArticleFormPhase1;

