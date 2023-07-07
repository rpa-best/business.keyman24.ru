import React, { FC, useEffect, useRef, useState } from 'react'
import {
    Outlet,
    useLoaderData,
    useLocation,
    useNavigate,
} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Sidebar from './Sidebar/Sidebar'
import TopNav from './TopNav'
import '../assets/styles/scss/mainPage.scss'
import 'react-toastify/dist/ReactToastify.css'
import { useAppDispatch, useAppSelector } from '../hooks/useReduxHooks'
import {
    fetchByIdOrg,
    removeOrganization,
    setOrganization,
} from '../store/slices/organizationSlice'
import Spinner from './Spinner/Spinner'
import socketHelper from '../helpers/sockets/socketHelper'
import TopNavOrgSelected from './TopNavOrgSelected'

const LayoutOrgSelected: FC = () => {
    const loaderData: any = useLoaderData()
    const { id } = loaderData
    const fetchedOrg = useAppSelector(state => state.org)
    const fetchedId = useAppSelector(state => state.org.currentOrg.id)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const fromPage = location.state?.from?.pathname || `/${id}`
    const [reRender, setReRender] = useState(false)

    // useEffect(() => {
    //     const dispatchedThunk = dispatch(fetchByIdOrg(id))

    //     return () => {
    //         dispatchedThunk.abort()
    //     }
    // }, [id])

    const socket = useRef<WebSocket>()
    const { VITE_WS_URL } = import.meta.env
    const fetcheduser = useAppSelector(state => state.account.user)
    // console.log(111)

    const getData = async () => {
        const dispatchedThunk2 = dispatch(
            fetchByIdOrg(id),
        )
        const fetchRes = await dispatchedThunk2.unwrap()
        // handleAddOg({ value: fetchRes.id, label: fetchRes.name })
        dispatch(setOrganization({ id: fetchRes.id, name: fetchRes.name }))
    }

    useEffect(() => {
        // const dispatchedThunk = dispatch(fetchByIdOrg(id))

        socket.current = new WebSocket(
            `${VITE_WS_URL}${
                fetcheduser?.username
            }/?token=${localStorage.getItem('token-access')}`,
        )

        socketHelper(socket.current, () => {})
        // console.log(VITE_WS_URL)

        getData()

        return () => {
            // dispatchedThunk.abort()
            socket.current?.close()
        }
    }, [id])

    if (fetchedOrg.isLoading === 'single') {
        return (
            <div className='d-flex min-vh-100 justify-content-center align-items-center'>
                <Spinner />
            </div>
        )
    }

    return (
        <>
            <TopNavOrgSelected />
            <main className='main-wrapper d-flex' id='modal-container'>
                <Sidebar />
                <div className='temp-content d-flex flex-column w-100 min-vh-100'>
                    <Outlet />
                    <ToastContainer />
                </div>
            </main>
        </>
    )
}

export default LayoutOrgSelected
