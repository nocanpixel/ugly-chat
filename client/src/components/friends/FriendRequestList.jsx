import React, { useCallback, useEffect, useState } from 'react';
import { LoadingIcon } from '../CustomIcons';
import usersApi from '../../api/users';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

const enumFriend = {
  accepted:'accepted',
  pending:'pending',
  rejected:'rejected'
}

export const FriendRequestList = () => {
  const [data, setData] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getFriendRequest = useCallback(async()=>{
    try{
      setIsLoading(true);
      const responses = await usersApi.getFriendRequest();
      setData(responses.data)
      setIsLoading(false);
    }catch(error){
      console.error(error);
    }
  },[])

  const handdleAccept = async(id) => {
    try{
      const response = await usersApi.putFriendRequest({
        request_id:id,
        response:enumFriend.accepted,
      });
      const {data} = response;
      setResult(data)
    }catch(error){
      console.error(error)
    }
  }

  const handdleReject = async(id) => {
    try {
      const response = await usersApi.putFriendRequest({
        request_id:id,
        response:enumFriend.rejected,
      });
      const {data} = response;
      setResult(data);
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(()=>{
    getFriendRequest();
  },[result])


  return (
    <section className='flex flex-col gap-4 pt-12'>
      <header>
        <h1 className='text-3xl font-bold p-2'>{'Friends requests'}</h1>
      </header>
      <div className="flex flex-col p-2 gap-4">
        <h2 className='font-bold text-sm'>Last 7 days</h2>

        {!isLoading ? (
          <>
            {data?.length > 0 ? data?.map((ele,index) => (
              <div key={index} className='flex flex-grow gap-2'>
                <div className='flex bg-sky-500 text-white justify-center items-center rounded-full overflow-hidden shadow-xl w-8 h-8 relative'>
                  <span className='text-xs font-semibold'>{ele.user.split('')[0].toUpperCase()}</span>
                </div>
                <div className='flex flex-grow items-center'>
                  <span className='flex flex-grow'>
                    <span className='text-xs w-52 whitespace-normal overflow-hidden'><span className='font-bold'>{ele.user}</span> sent you a friend request.</span>
                  </span>
                  <div className='flex gap-2'>
                    <div onClick={()=> handdleReject(ele.friendship_id)} className='hover:ring-2 ring-indigo-500 p-1 rounded-full ring-offset-1 flex items-center justify-center text-indigo-500 cursor-pointer'>
                      <span className='text-xs font-semibold w-4'><XMarkIcon/></span>
                    </div>
                    <div onClick={()=> handdleAccept(ele.friendship_id)} className='hover:ring-2 ring-indigo-500 p-1 rounded-full ring-offset-1 flex items-center justify-center text-white bg-indigo-500 hover:bg-indigo-600  cursor-pointer  '>
                      <span className='text-xs font-semibold w-4'><CheckIcon/></span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="flex justify-center items-center m-auto mt-32">
                <span className='text-xs text-slate-400'>{`We couldn't find any friend request`}</span>
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-center items-center m-auto mt-32">
            <div className='w-8 flex justify-center flex-col items-center'>
              <LoadingIcon />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
