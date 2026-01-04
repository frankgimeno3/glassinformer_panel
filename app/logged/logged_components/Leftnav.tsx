"use client"
import Link from 'next/link';
import { FC } from 'react';

interface LeftnavProps {

}

const Leftnav: FC<LeftnavProps> = ({ }) => {
  return (
    <div className='flex flex-col bg-gray-100 pl-3 ' style={{ "width": "200px" }}>
      <Link href='/logged/pages/articles' className='flex flex-row  hover:bg-gray-200/50 hover:text-gray-900 pl-4 py-4 cursor-pointer'>
        <p>Articles</p>
      </Link>
      <Link href='/logged/pages/publications' className='flex flex-row  hover:bg-gray-200/50 hover:text-gray-900 pl-4 py-4 cursor-pointer'>
        <p>Publications</p>
      </Link>
      <Link href='/logged/pages/users' className='flex flex-row  hover:bg-gray-200/50 hover:text-gray-900 pl-4 py-4 cursor-pointer'>
        <p>Users</p>
      </Link>
    </div>
  );
};

export default Leftnav;