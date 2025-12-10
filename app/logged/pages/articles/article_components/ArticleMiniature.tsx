import { useRouter } from "next/navigation";
import React, { FC } from "react";

interface ArticleMiniatureProps {
  id_article: string;
  titulo: string;
  company: string;
  date: string;
}

const ArticleMiniature: FC<ArticleMiniatureProps> = ({
  id_article,
  titulo,
  company,
  date,
}) => {

    const router = useRouter()

  return (
    <div className="flex flex-col shadow-xl cursor-pointer w-80 p-2 border-t border-gray-100 bg-gray-100/50 hover:bg-white h-96"
    onClick={()=>{router.push(`/logged/pages/articles/${id_article}`)}}>
      <div className="bg-gray-500 h-56" />

      <div className="flex flex-col p-3">
        <p className="font-semibold line-clamp-2">{titulo}</p>

        <div className="flex flex-row justify-between text-sm pt-6">
          <p className="text-gray-400 italic">{date}</p>
          <p>{company}</p>
        </div>

        <p className="text-[10px] text-gray-400 mt-3">ID: {id_article}</p>
      </div>
    </div>
  );
};

export default ArticleMiniature;
