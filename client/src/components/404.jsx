import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Cookie } from '../utils/tools';

const cookie = new Cookie();

export const NotFound404 = () => {
  const navigate = useNavigate();
  return (
    <section className='flex justify-center items-center h-screen'>

      <div className='bg-white rounded-lg overflow-hidden flex flex-col'>
        <div className='flex flex-col items-center justify-center py-4 gap-2'>
        <h1 className='text-xl font-semibold text-gray-600'>Something went wrong...</h1>
        <span className='max-w-[30em] text-center text-gray-500'>Seems like you are having connection problems or this page doesn't even exists.</span>
        </div>
        <div className='w-full bg-gray-100 flex justify-center items-center py-4 px-10'>
        <button onClick={()=> navigate('/login')} className='bg-indigo-500 w-full py-3 rounded-md text-white '>Go back</button>
        </div>
      </div>

    </section>
  )
}
