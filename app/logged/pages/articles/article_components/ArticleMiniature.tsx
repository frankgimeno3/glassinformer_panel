import React, { FC } from 'react';

interface ArticleMiniatureProps {

}

const ArticleMiniature: FC<ArticleMiniatureProps> = ({ }) => {
    return (
        <div className='flex flex-col shadow-xl cursor-pointer w-80 p-2 border-t border-gray-100 bg-gray-100/50 hover:bg-white h-96'>
            <div className='bg-gray-500 h-56'>
            </div>
            <div className='flex flex-col p-3'>
                <p>Tittle of the article to be shown, a bit long in case it has more content than expected, just to see how it looks</p>
                <div className='flex flex-row justify-between text-sm pt-6'>
                    <p className=' text-gray-400 italic '>10/12/2026</p>
                    <p className=''>Company name</p>
                </div>
            </div>
        </div>
    );
};

export default ArticleMiniature;