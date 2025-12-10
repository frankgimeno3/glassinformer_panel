"use client"

import React, { FC } from 'react';
import Leftnav from './logged_components/Leftnav';

interface LoggedProps {

}

const Logged: FC<LoggedProps> = ({ }) => {
  return (
    <div className='flex flex-col w-full bg-white p-12'>

      <p className='font-bold text-2xl'>Welcome, user</p>

      <p className='mt-12 font-bold mb-3'>Main notifications</p>
      <div className=' flex flex-col bg-gray-100 pb-1 shadow-xl border-t border-gray-100'>
        <div className='flex flex-row justify-between bg-white p-4  border-b border-gray-100 cursor-pointer hover:bg-white/70'>
          <p>Brief notification description</p>
          <p>10/12/2025 - 12:34:54</p>
        </div>
        <div className='flex flex-row justify-between bg-white p-4  border-b border-gray-100 cursor-pointer hover:bg-white/70'>
          <p>Brief notification description</p>
          <p>10/12/2025 - 12:34:54</p>
        </div>
        <div className='flex flex-row justify-between bg-white p-4  border-b border-gray-100 cursor-pointer hover:bg-white/70'>
          <p>Brief notification description</p>
          <p>10/12/2025 - 12:34:54</p>
        </div>
        <div className='flex flex-row justify-between bg-white p-4  border-b border-gray-100 cursor-pointer hover:bg-white/70'>
          <p>Brief notification description</p>
          <p>10/12/2025 - 12:34:54</p>
        </div>
        <div className='flex flex-row justify-between bg-white p-4  border-b border-gray-100 cursor-pointer hover:bg-white/70'>
          <p>Brief notification description</p>
          <p>10/12/2025 - 12:34:54</p>
        </div>
        <div className='flex flex-row justify-end'>
          <button className='bg-white text-gray-600 hover:bg-white/50 px-4 py-2 m-3 cursor-pointer'>
            See all notifications
          </button>
        </div>
      </div>

        <p className='mt-12 font-bold mb-3'>Information connected to Google analytics here</p>
        <div className='bg-gray-100 w-full shadow-xl' style={{   "height": "200px" }}></div>

        <p className='mt-12 font-bold mb-3'>User Log</p>
      <div className=' flex flex-col bg-gray-100 pb-1 shadow-xl border-t border-gray-100'>
          <div className='flex flex-row justify-between bg-white p-4  border-b border-gray-100'>
            <p>User this, did that</p>
            <p>10/12/2025 - 12:34:54</p>
          </div>
          <div className='flex flex-row justify-between bg-white p-4  border-b border-gray-100'>
            <p>User this, did that</p>
            <p>10/12/2025 - 12:34:54</p>
          </div>
          <div className='flex flex-row justify-between bg-white p-4  border-b border-gray-100'>
            <p>User this, did that</p>
            <p>10/12/2025 - 12:34:54</p>
          </div>
          <div className='flex flex-row justify-between bg-white p-4  border-b border-gray-100'>
            <p>User this, did that</p>
            <p>10/12/2025 - 12:34:54</p>
          </div>
          <div className='flex flex-row justify-end'>
            <button className='bg-white text-gray-600 hover:bg-white/50 px-4 py-2 m-3 cursor-pointer'>
              See full log
            </button>
          </div>
        </div>
      </div>
      );
};

      export default Logged;