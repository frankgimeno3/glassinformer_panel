"use client"
import { useRouter } from 'next/navigation';
import React, { FC } from 'react';

interface TopnavProps {
  
}

const Topnav: FC<TopnavProps> = ({ }) => {
    const router = useRouter()
  return (
    <nav className='flex flex-row bg-blue-950 text-gray-200 justify-between p-12'>
        <p className='text-3xl hover:text-white cursor-pointer'
        onClick={()=>{router.push('/logged')}}>Glassinformer Pannel</p>

        <button className='bg-white text-blue-950 cursor-pointer hover:bg-gray-100/80 px-5 py-1 rounded-xl shadow-xl'>
        Log out
        </button>
    </nav>
  );
};

export default Topnav;