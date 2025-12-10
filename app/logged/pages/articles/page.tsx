"use client"
import { FC } from 'react';
import ArticleMiniature from './article_components/ArticleMiniature';
import ArticleFilter from './article_components/ArticleFilter';
import { useRouter } from 'next/navigation';
 
interface ArticlesProps {}

const Articles: FC<ArticlesProps> = ({ }) => {

  const router = useRouter()

  return (
    <div className='flex flex-col w-full bg-white'>
      <div className='flex flex-col text-center bg-blue-950/70 p-5 px-46 text-white'>
        <p className='text-2xl'>All articles</p>
        <button className='bg-blue-950 text-white text-xs px-4 py-1 rounded-xl shadow cursor-pointer w-26 mx-auto mt-2 hover:bg-blue-950/80'
        onClick={()=>{router.push('/logged/pages/articles/create')}}>
          Create article
        </button>
      </div>

      <ArticleFilter />



      <div className='flex flex-col py-5 gap-12 mx-auto'>
        <div className='flex flex-row gap-5'>
          <ArticleMiniature />
          <ArticleMiniature />
          <ArticleMiniature />
        </div>
        <div className='flex flex-row gap-5'>
          <ArticleMiniature />
          <ArticleMiniature />
          <ArticleMiniature />
        </div>
        <div className='flex flex-row gap-5'>
          <ArticleMiniature />
          <ArticleMiniature />
          <ArticleMiniature />
        </div>
      </div>
    </div>
  );
};

export default Articles;
