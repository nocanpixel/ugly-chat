import React from 'react'
import usersApi from '../../api/users.js';
import { useOutletContext } from 'react-router-dom';

const Chat = () => {
  const { user } = useOutletContext();
  const { name } = user.res;

  const getUsers = async () => {
    try {
      const response = await usersApi.getAll();
      console.log(response)
    }catch(error){
      console.warn(error)
    }
  }

  return (
    <div className='flex flex-col w-full gap-2 items-center'>
      <span>Bienvenido <span className='font-bold'>{name}</span> 😇</span>
      <button className='bg-indigo-600 text-white rounded-md py-2 w-full' onClick={()=> getUsers()}>Get users</button>
    </div>
  )
}


export default Chat;