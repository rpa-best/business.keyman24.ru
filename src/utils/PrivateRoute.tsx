import React from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import TopNav from '../components/TopNav'
import { useAppSelector } from '../hooks/useReduxHooks'

const PrivateRoute = () => {
    const location = useLocation()
    const { isAuth, user } = useAppSelector(state => state.account)

    // eslint-disable-next-line no-nested-ternary
    return isAuth ? (
        user?.has_business ? (
            <>
                {/* <TopNav /> */}
                <Outlet />
            </>
        ) : (
            <Navigate to='/404' state={{ from: location }} />
        )
    ) : (
        <Navigate to='/login' state={{ from: location }} />
    )
}

export default PrivateRoute
