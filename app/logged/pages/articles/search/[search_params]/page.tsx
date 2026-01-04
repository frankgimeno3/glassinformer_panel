import ArticleMiniature from '@/app/logged/pages/articles/article_components/ArticleMiniature';
import ArticleFilter from '../../article_components/ArticleFilter';

import articlesData from '@/app/contents/articlesContents.json';
import contentsData from '@/app/contents/contentsContents.json';

type FilterType = 'date' | 'title' | 'company';

const isFilterType = (value: string): value is FilterType => {
  return value === 'date' || value === 'title' || value === 'company';
};

const formatDateForDisplay = (raw: string): string => {
  if (!raw) return '';
  const parts = raw.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  return raw;
};

interface ArticleFromJson {
  id_article: string;
  articleTitle: string;
  articleSubtitle: string;
  article_main_image_url: string;
  company: string;
  date: string;
  article_tags_array: string[];
  contents_array: string[];
}

interface ContentFromJson {
  content_id: string;
  content_type: string;
  content_content: {
    left?: string;
    right?: string;
    center?: string;
  };
}

interface PageProps {
  params: {
    search_params: string;
  };
}

const ArticleSearchResults = async ({ params }: PageProps) => {
  const decoded = decodeURIComponent(params.search_params ?? '');
  const [rawType, ...rest] = decoded.split('__');
  const type: FilterType | null = isFilterType(rawType) ? rawType : null;
  const value = rest.join('__');

  let heading = 'Results';

  if (type === 'date') {
    heading = `Articles for date ${formatDateForDisplay(value)}`;
  } else if (type === 'title') {
    heading = `Articles with coincidences with "${value}"`;
  } else if (type === 'company') {
    heading = `Articles related to company ${value}`;
  }

  const articles: ArticleFromJson[] = articlesData as ArticleFromJson[];
  const contents: ContentFromJson[] = contentsData as ContentFromJson[];

  const contentsById: Record<string, ContentFromJson> = Object.fromEntries(
    contents.map((c) => [c.content_id, c])
  );

  const filteredArticles = articles.filter((a) => {
    if (!type) return true;
    if (!value) return true;

    if (type === 'date') {
      return a.date === value;
    }

    if (type === 'company') {
      return a.company.toLowerCase().includes(value.toLowerCase());
    }

    if (type === 'title') {
      return a.articleTitle.toLowerCase().includes(value.toLowerCase());
    }

    return true;
  });

  return (
    <div className='flex flex-col w-full bg-white'>
      <div className='flex flex-col text-center bg-blue-950/70 p-5 px-46 text-white'>
        <h2 className='text-xl font-semibold'>{heading}</h2>
        {type && value && (
          <p className='text-xs text-gray-200 mt-1'>
            Search type: <span className='font-mono'>{type}</span> · Query:{' '}
            <span className='font-mono'>
              {type === 'date' ? formatDateForDisplay(value) : value}
            </span>
          </p>
        )}
      </div>

      <ArticleFilter />

      <div className='flex flex-col py-5 gap-12 mx-auto'>
        <div className='flex flex-row gap-5 flex-wrap'>
          {filteredArticles.map((a) => (
            <ArticleMiniature
              key={a.id_article}
              id_article={a.id_article}
              titulo={a.articleTitle}
              company={a.company}
              date={a.date}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleSearchResults;
