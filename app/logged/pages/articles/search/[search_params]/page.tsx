import ArticleMiniature from '@/app/logged/pages/articles/article_components/ArticleMiniature';
import ArticleFilter from '../../article_components/ArticleFilter';

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

interface PageProps {
  params: Promise<{
    search_params: string;
  }>;
}

const ArticleSearchResults = async ({ params }: PageProps) => {
  const { search_params } = await params;

  const decoded = decodeURIComponent(search_params ?? '');
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

export default ArticleSearchResults;
