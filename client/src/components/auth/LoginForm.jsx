import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { firstUpperCase } from '../../utils/shortCuts';
import authApi from '../../api/auth';
import { LayoutContainer, LayoutSection, LoginSection } from '../../styles';


const data = [
  {
    id: 1,
    name: 'email',
    type: 'email',
  },
  {
    id: 2,
    name: 'password',
    type: 'password',
  }
]

export default function LoginForm() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (event) => {
    setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const fetchAuth = async () => {
    try {
      const response = await authApi.login(formData);
      if (response) {
        navigate('/')
      }
    } catch (error) {
      console.error(error.response.data.error)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchAuth();
  }


  return (
    <LayoutSection>
      <LayoutContainer>
        <LoginSection>
          <header>
            <h1 className='text-4xl font-bold'>{'Login'}</h1>
          </header>
          <form onSubmit={handleSubmit} className='flex flex-col gap-12 w-full'>
            <div className='flex flex-col gap-3'>
              {data.map((ele, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <label className='font-bold text-sm' htmlFor={ele.name}>{firstUpperCase(ele.name)}</label>
                  <input required onChange={handleChange} name={ele.name} placeholder={ele.name} className="block w-full rounded-md border-0 py-2 px-4 pr-20 text-gray-900 ring-1 ring-neutral-100 bg-neutral-100 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" type={ele.type} id={ele.name} />
                </div>
              ))}
            </div>
            <div className='flex flex-col gap-2 text-center'>
              <button type='submit' className='bg-indigo-600 py-1 rounded-full text-white text-lg font-bold'>{'LogIn'}</button>
              <span className='text-neutral-400 text-sm'>{"If you don't have an account"} <span onClick={() => navigate('/signup')} className='text-indigo-600 cursor-pointer'>{"SignUp"}</span></span>
            </div>
          </form>
        </LoginSection>
      </LayoutContainer>
    </LayoutSection>
  )
}
