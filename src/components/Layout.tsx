import React, { FC, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Sidebar from './Sidebar/Sidebar'
import TopNav from './TopNav'
import '../assets/styles/scss/mainPage.scss'
import 'react-toastify/dist/ReactToastify.css'
import { useAppDispatch, useAppSelector } from '../hooks/useReduxHooks'
import { removeOrganization } from '../store/slices/organizationSlice'
import Spinner from './Spinner/Spinner'

const Layout: FC = () => {
    const dispatch = useAppDispatch()
    const { currentOrg } = useAppSelector(state => state.org)
    const location = useLocation()
    const navigate = useNavigate()

    const getData = () => {

    }

    useEffect(() => {
        dispatch(removeOrganization())

        // if (!!id && location?.pathname.split('/')[0] !== String(id)) {
        //     navigate(`/${id}/`)
        // } else {
        //     console.log(11111)
        // }
    }, [])

    return (
        <>
            <TopNav />
            <main className='main-wrapper d-flex'>
                {/* <Sidebar /> */}
                <div className='temp-content d-flex flex-column w-100 min-vh-100'>
                    <Spinner />
                    {/* <Outlet /> */}
                    <ToastContainer />
                </div>
            </main>
        </>
    )
}

export default Layout
