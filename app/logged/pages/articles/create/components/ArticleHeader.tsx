import React, { FC } from "react";

interface ArticleHeaderProps {
  currentPhase: 1 | 2 | 3;
}

const ArticleHeader: FC<ArticleHeaderProps> = ({ currentPhase }) => {
  return (
    <div className="flex flex-col text-center bg-blue-950/70 p-5 px-46 text-white">
      <p className="text-2xl">Crear Nuevo Artículo</p>
      <p className="text-sm mt-2">Fase {currentPhase} de 3</p>
    </div>
  );
};

export default ArticleHeader;

