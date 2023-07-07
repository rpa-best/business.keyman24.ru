import React, { FC, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../hooks/useReduxHooks'
import { auth, me } from '../store/slices/accountSlice'
import '../assets/styles/scss/loginPage.scss'
import circleAnimation from '../config/motionAnimations'
import Spinner from '../components/Spinner/Spinner'
import FormInput from '../components/FormInput'
import { ToastContainer, toast } from 'react-toastify'
import ToastMessage from '../components/ToastMessage'

const LoginPage: FC = () => {
    const dispatch = useAppDispatch()

    const navigate = useNavigate()
    const location = useLocation()
    const fromPage = location.state?.from?.pathname || '/'

    const [name, setUsername] = useState('')
    const [pass, setPass] = useState('')

    const { isLoading, error } = useAppSelector(state => state.account)

    useEffect(() => {
        if (localStorage.getItem('token-access')) {
            dispatch(me()).then(data => {
                if (data?.type === 'account/me/fulfilled') {
                    navigate(fromPage)
                }
                // navigate(fromPage)
            })
        }
    }, [])

    // useEffect(() => {
    //     const dispatchedThunk = localStorage.getItem('token-access') && dispatch(me())

    //     // eslint-disable-next-line no-unused-expressions
    //     localStorage.getItem('token-access') && dispatchedThunk && dispatchedThunk.then(() => {
    //         navigate(fromPage)
    //     })

    //     return () => {
    //         // eslint-disable-next-line no-unused-expressions
    //         localStorage.getItem('token-access')
    //                 && dispatchedThunk
    //                 && dispatchedThunk.abort()
    //     }
    // }, [])

    const handleLogin = (username: string, password: string) => {
        dispatch(auth({ username, password })).then(data => {
            if (data?.type === 'account/auth/fulfilled') {
                dispatch(me()).then(() => {
                    navigate(fromPage)
                })
            }
            if (
                data?.type === 'account/auth/rejected' &&
                data?.payload?.message
            ) {
                console.log(1111)
                toast.error(
                    <ToastMessage
                        name={data?.payload?.message[0]?.name}
                        desc={data?.payload?.message[0]?.desc}
                    />,
                    {
                        position: 'bottom-right',
                        theme: 'colored',
                        autoClose: 5000,
                    },
                )
            }
        })
    }

    if (isLoading) {
        return (
            <div className='d-flex min-vh-100 justify-content-center align-items-center'>
                <Spinner />
            </div>
        )
    }

    return (
        <motion.div
            initial='hidden'
            whileInView='visible'
            className='login-wrapper d-flex min-vh-100'
        >
            {Array.from({ length: 4 }, (_, index) => index + 1).map(item => {
                return (
                    <motion.span
                        custom={item}
                        variants={circleAnimation}
                        className={`circle c-${item}`}
                        key={item}
                    />
                )
            })}
            <div className='preview-wrapper flex-column w-100'>
                <h1 className='logo'>KeyMan24</h1>
                <div className='preview-content d-flex flex-column justify-content-center h-100'>
                    <h1>Lorem ipsum </h1>
                    <span>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Tempora blanditiis eveniet quis eaque quisquam
                        repudiandae. Inventore enim, odio unde velit dicta
                        deserunt! Provident ullam reprehenderit recusandae a,
                        vel quia aperiam.
                    </span>
                </div>
            </div>
            <div className='form-wrapper d-flex flex-column w-100'>
                <h1 className='logo'>KeyMan24</h1>
                <div className='form-content-wrapper d-flex justify-content-center align-items-center h-100 w-100'>
                    <form
                        className='form-content d-flex flex-column'
                        autoComplete='off'
                    >
                        <h1 className='h1'>Вход</h1>
                        {/* <input
                            type='text'
                            value={name}
                            onChange={e => setUsername(e.target.value)}
                            placeholder='Введите логин'
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    handleLogin(name, pass)
                                }
                            }}
                            style={{ marginTop: '35px' }}
                            className='login-input'
                        /> */}
                        <FormInput
                            name='login'
                            label='Введите логин'
                            value={name}
                            classNameWrapper={['login-input-wrapper']}
                            classNameInput={['login-input']}
                            usePlaceholder
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    handleLogin(name, pass)
                                }
                            }}
                            onChange={e => setUsername(e.target.value)}
                            error={
                                error?.username ? error?.username[0] : undefined
                            }
                        />
                        <FormInput
                            name='password'
                            label='Введите пароль'
                            value={pass}
                            type='password'
                            classNameWrapper={['login-input-wrapper']}
                            classNameInput={['login-input']}
                            usePlaceholder
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    handleLogin(name, pass)
                                }
                            }}
                            onChange={e => setPass(e.target.value)}
                            error={
                                error?.password ? error?.password[0] : undefined
                            }
                        />
                        {/* <input
                            type='password'
                            value={pass}
                            onChange={e => setPass(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    handleLogin(name, pass)
                                }
                            }}
                            placeholder='Введите пароль'
                            style={{ marginTop: '30px' }}
                        /> */}
                        <span style={{ textDecorationLine: 'underline' }}>
                            <a href='/'>Забыли пароль</a>
                        </span>
                        <button
                            type='button'
                            onClick={() => handleLogin(name, pass)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    handleLogin(name, pass)
                                }
                            }}
                            style={{ marginTop: '29px' }}
                        >
                            Войти
                        </button>
                        <span>
                            Вводя свой логин, вы подтверждаете, что согласны с
                            нашими
                            <a href='/' className='text-green'>
                                {' '}
                                Условиями предоставления услуг.
                            </a>
                        </span>
                    </form>
                    <ToastContainer />
                </div>
            </div>
        </motion.div>
    )
}

export default LoginPage
