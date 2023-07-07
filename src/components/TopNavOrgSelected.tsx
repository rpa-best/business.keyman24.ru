import React, { FC, useEffect, useState } from 'react'
import { useNavigate, Link, useLocation, useLoaderData } from 'react-router-dom'
import '../assets/styles/scss/topNav.scss'
import Select from 'react-select/async'
import { useAppDispatch, useAppSelector } from '../hooks/useReduxHooks'
import { logout } from '../store/slices/accountSlice'
import { ReactComponent as SVGNotifications } from '../assets/img/topnav/notifications.svg'
import { ReactComponent as SVGMessages } from '../assets/img/topnav/messages.svg'
import { ReactComponent as SVGSettings } from '../assets/img/shared/settings.svg'
import SVGAvatar from '../assets/img/topnav/avatar.svg'
import { ReactComponent as SVGDropdownArrow } from '../assets/img/topnav/dropdown-arrow.svg'
import useTheme from '../hooks/useTheme'
import { themeUnset, headerSelectStyles } from '../config/selectStyles'
import organizationSlice, {
    fetchByIdOrg,
    fetchByNameOrg,
    fetchOrg,
    removeOrganization,
    setOrganization,
} from '../store/slices/organizationSlice'
import Spinner from './Spinner/Spinner'
import InlineSpinner from './Spinner/InlineSpinner'
import PhotoPreload from './PhotoPreload'

interface SelectOptions {
    value: number
    label: string
}

interface TopNavProps {
    // reRender: (value: boolean) => void
}

const TopNavOrgSelected: FC<TopNavProps> = props => {
    // const { reRender } = props
    const user = useAppSelector(state => state.account.user)
    const { list, currentOrg, isLoading } = useAppSelector(state => state.org)
    const { id } = useAppSelector(state => state.org.currentOrg)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    // const fromPage = location.state?.from?.pathname || `/${id}`

    const { theme, setTheme } = useTheme()

    const handleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    // const loaderData: any = useLoaderData()
    // const { id: idFromLoaderData } = loaderData

    const handleClick = () => {
        dispatch(logout())
        navigate('/login')
    }

    const handleAddOg = (value: any) => {
        if (value !== null) {
            dispatch(setOrganization({ id: value.value, name: value.label }))
            // navigate(`/${value.value}/`)
            const path = location?.pathname
                .split('/')
                .map((item, index) => (index === 1 ? value.value : item))
                .reduce((prev, curr) => prev.concat(`/${curr}`))
            if (path !== location?.pathname) {
                navigate(path.lenght === 0 ? `/${value.value}` : path)
            }
        }
    }

    const opts = list.map(item => {
        return {
            value: item.id,
            label: item.name,
        }
    })

    const filterOptions = (inputValue: string): SelectOptions[] => {
        return list.map(item => {
            return {
                value: item.id,
                label: item.name,
            }
        })
    }

    const loadOrgs = (
        inputValue: string,
        callback: (options: SelectOptions[]) => void,
    ) => {
        setTimeout(() => {
            if (inputValue) {
                dispatch(fetchByNameOrg(inputValue))
                callback(filterOptions(inputValue))
            }
        }, 500)
    }

    useEffect(() => {
        const dispatchedThunk1 = dispatch(fetchOrg())

        return () => {
            dispatchedThunk1.abort()
        }
    }, [])

    // useEffect(() => {}, [id])

    // const getData = async () => {
    //     const dispatchedThunk1 = dispatch(fetchOrg())
    //     const result = await dispatchedThunk1.unwrap()

    //     if (
    //         localStorage.getItem('currOrg') !== 'undefined' &&
    //         localStorage.getItem('currOrg') !== null
    //     ) {
    //         // console.log(localStorage.getItem('currOrg'))
    //         const dispatchedThunk2 = dispatch(
    //             fetchByIdOrg(Number(localStorage.getItem('currOrg'))),
    //         )
    //         const fetchRes = await dispatchedThunk2.unwrap()
    //         handleAddOg({ value: fetchRes.id, label: fetchRes.name })
    //         return
    //     }

    //     if (id === undefined) {
    //         handleAddOg({ value: result[0].id, label: result[0].name })
    //     }
    // }

    // const getData = async () => {
    //     const dispatchedThunk2 = dispatch(
    //         fetchByIdOrg(idFromLoaderData),
    //     )
    //     const fetchRes = await dispatchedThunk2.unwrap()
    //     // handleAddOg({ value: fetchRes.id, label: fetchRes.name })
    //     dispatch(setOrganization({ id: fetchRes.id, name: fetchRes.name }))
    // }

    // useEffect(() => {
    //     getData()
    //     // const dispatchedThunk1 = dispatch(fetchOrg())

    //     return () => {
    //         // dispatchedThunk1.abort()
    //         // dispatchedThunks.forEach(thunk => {
    //         //     console.log(thunk)
    //         //     if (thunk.abort) {
    //         //         thunk.abort()
    //         //     }
    //         // })
    //     }
    // }, [])

    // useEffect(() => {
    //     const dispatchedThunk1 = dispatch(fetchOrg())
    //     // const dispatchedThunk2 = dispatch(fetchByIdOrg(idFromLoaderData))
    //     //     .unwrap()
    //     //     .then(originalPromiseResult => {
    //     //         // handle result here
    //     //     })
    //     getData()

    //     return () => {
    //         dispatchedThunk1.abort()
    //         // dispatchedThunk2.abort()
    //     }
    // }, [])

    return (
        <div className='topnav-wrapper d-flex'>
            <div className='topnav d-flex w-100 justify-content-between'>
                <div className='title-wrapper d-flex'>
                    <Link to={`/${id}/`}>
                        <h1>KeyMan24</h1>
                    </Link>
                    <span className='separator' />
                    <h2>Business</h2>
                </div>
                <div className='tools-wrapper d-flex'>
                    <div className='notifications tools-icon'>
                        <Link to={`/${id}/org-settings`}>
                            <SVGSettings
                                style={{ height: '30px', width: '30px', marginRight: '15px' }}
                                stroke='#a1a1a1'
                            />
                        </Link>
                    </div>
                    <Select
                        placeholder='выбрать организацию'
                        noOptionsMessage={() => 'name not found'}
                        onChange={handleAddOg}
                        styles={headerSelectStyles}
                        cacheOptions
                        loadOptions={loadOrgs}
                        isLoading={!!isLoading}
                        defaultOptions={opts}
                        value={
                            id
                                ? ((opts
                                      ? opts.find(option => option.value === id)
                                      : '') as any)
                                : null
                        }
                        theme={defTheme => themeUnset(defTheme)}
                        className='header-select'
                    />
                    <span className='separator' />
                    <div className='notifications tools-icon'>
                        <a href='/'>
                            <SVGNotifications
                                style={{ height: '24px', width: '22px' }}
                            />
                        </a>
                    </div>
                    <div
                        className='messages tools-icon'
                        style={{ marginLeft: '25px' }}
                    >
                        <a href='/'>
                            <SVGMessages
                                style={{ height: '22px', width: '24px' }}
                            />
                        </a>
                    </div>
                    <span className='separator' />
                    <div className='dropdown'>
                        <div
                            className='btn user-wrapper'
                            role='button'
                            data-bs-toggle='dropdown'
                            aria-expanded='false'
                        >
                            <div className='avatar tools-icon'>
                                {/* <SVGAvatar
                                    style={{
                                        height: '40px',
                                        width: '40px',
                                    }}
                                /> */}
                                <PhotoPreload
                                    image={user?.avatar ?? SVGAvatar}
                                    preload={SVGAvatar}
                                    alt='worker_photo'
                                />
                            </div>
                            <div className='user'>
                                <div className='name'>{`${user?.name} ${user?.surname}`}</div>
                                <div className='role'>{user?.username}</div>
                            </div>
                            <div className='dropdown-arr tools-icon'>
                                <SVGDropdownArrow
                                    style={{
                                        height: '15px',
                                        width: '15px',
                                    }}
                                />
                            </div>
                        </div>
                        <ul className='dropdown-menu'>
                            <li className='dropdown-item'>
                                <button
                                    type='button'
                                    onClick={() => handleTheme()}
                                >
                                    Сменить тему
                                </button>
                            </li>
                            <li className='dropdown-item'>
                                <button
                                    type='button'
                                    onClick={() => handleClick()}
                                >
                                    Выйти
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopNavOrgSelected
