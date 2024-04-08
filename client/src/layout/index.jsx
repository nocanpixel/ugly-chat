import React from 'react'
import { LayoutSection, LayoutBody, LayoutContainer, LayoutHeader } from '../styles';
import { Outlet } from 'react-router-dom';
import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/solid'
import { withAuthentication } from '../helpers/withAuthentication';
import usersApi from '../api/users';


const Layout = withAuthentication((props) => {

  const logout = async () => {
    try {
      await usersApi.logout();
    } catch (error) {
      console.error('Error', error)
    }
  }


  return (
    <LayoutSection>
      <LayoutContainer>
        <LayoutHeader>
          <div onClick={() => logout()} className='flex flex-row items-center cursor-pointer text-gray-400 hover:text-gray-600'>
          <span className="text-sm">{'Logout'}</span>
          <ArrowLeftEndOnRectangleIcon className='w-6' />
          </div>
        </LayoutHeader>
        <LayoutBody>
          <Outlet context={{ ...props }} />
        </LayoutBody>
      </LayoutContainer>
    </LayoutSection>
  )
})

export default Layout;