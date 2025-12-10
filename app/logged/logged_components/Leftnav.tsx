"use client"
import { useRouter } from 'next/navigation';
import { FC } from 'react';

interface LeftnavProps {
  
}

const Leftnav: FC<LeftnavProps> = ({ }) => {
  const router = useRouter()
  return (
    <div className='flex flex-col bg-gray-100 pl-3 ' style={{"width":"200px"}}>
        <div className='flex flex-row  hover:bg-gray-200/50 hover:text-gray-900 pl-4 py-4 cursor-pointer'
        onClick={()=>{router.push('/logged/pages/articles')}}> 
            <p>Articles</p>
        </div>
        <div className='flex flex-row  hover:bg-gray-200/50 hover:text-gray-900 pl-4 py-4 cursor-pointer'
        onClick={()=>{router.push('/logged/pages/publications')}}> 
            <p>Publications</p>
        </div>
    </div>
  );
};

export default Leftnav;