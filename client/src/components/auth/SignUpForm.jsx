import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthSection, LayoutContainer, LayoutSection } from '../../styles';
import { firstUpperCase } from '../../utils/shortCuts';
import authApi from '../../api/auth';
import { getInputName } from '../../utils/getInputName';
import { useSpring, animated } from '@react-spring/web';

const data = [
  {
    id: 1,
    name: 'username',
    type: 'text'
  },
  {
    id: 2,
    name: 'email',
    type: 'email',
  },
  {
    id: 3,
    name: 'password',
    type: 'password',
  }
]

const SignUpForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [state, toggle] = useState(false);


  const { x } = useSpring({
    from: { x: 0 },
    x: state ? 1 : 0,
    config: { duration: 500 },
  });

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (event) => {
    setFormData(prev => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const fetchSignUp = async () => {
    try {
      const response = await authApi.register(formData);
      setError(response.data.error);
      toggle(!state)
      if (response.data.error) return;
      navigate('/')
    } catch (error) {
      console.error(error.response.data.error)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchSignUp();
  }

  console.log(error,state)

  const resolveState = () => {
    return new Promise((resolve)=>{
      if(!state){
        setTimeout(()=>{
          resolve(setError(undefined))
        },1000)
      }
    })
  }

  useEffect(()=>{
    (async()=>{
      if(error){
        await resolveState();
      }
    })()
  },[state])

  return (
    <LayoutSection>
      <LayoutContainer>
      <div className='relative flex justify-center'>
            <animated.div
              className={`bg-rose-400 text-white flex justify-center p-2 mx-2 text-center rounded-lg absolute top-5`}
              style={{
                opacity: x.to({ range: [0, 1], output: [0, 1] }),
              }}
            >
              <span className='text-sm'>{error}</span>
            </animated.div>
          </div>
        <AuthSection>
          <header>
            <h1 className='text-4xl font-bold'>{'Sign Up'}</h1>
          </header>
          <form onSubmit={handleSubmit} className='flex flex-col gap-12 w-full'>
            <div className='flex flex-col gap-3'>
              {data.map((ele, index) => (
                <div key={index} className={`flex flex-col gap-2`}>
                  <label className='font-bold text-sm' htmlFor={ele.name}>{firstUpperCase(ele.name)}</label>
                  <input onClick={() => {error && toggle(!state)}} onChange={handleChange} name={ele.name} placeholder={ele.name} className={`block w-full rounded-md border-0 py-2 px-4 pr-20 text-gray-900 ${state && getInputName(error) === ele.name ? 'ring-2 ring-rose-400' : 'ring-1 ring-neutral-100'} bg-neutral-100 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`} type={ele.type} id={ele.name} />
                </div>
              ))}
            </div>
            <div className='flex flex-col gap-2 text-center'>
              <button type='submit' className='bg-indigo-600 py-1 rounded-full text-white text-lg font-bold'>{'SignUp'}</button>
              <span className='text-neutral-400 text-sm'>{"If you already have an account"} <span onClick={() => navigate('/login')} className='text-indigo-600 cursor-pointer'>{"Login"}</span></span>
            </div>
          </form>
        </AuthSection>
      </LayoutContainer>
    </LayoutSection>
  )
}

export default SignUpForm