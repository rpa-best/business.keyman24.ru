import React from 'react'
import { useLoaderData } from 'react-router-dom'
import PickListPermissionAdmin from '../PickList/PickListPermissionAdmin'
import PickListPermissionGroupAdmin from '../PickList/PickListPermissionGroupAdmin'
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks'
import Header from '../Header'

const OrgSettings = () => {
    const dispatch = useAppDispatch()

    const loaderData: any = useLoaderData()
    const { id } = loaderData

    const { list, currentOrg, isLoading } = useAppSelector(state => state.org)

    return (
        <div className='outlet-wrapper flex-column'>
            <div className='default-wrapper'>
                <Header
                    title={currentOrg.name ?? ''}
                    className='justify-content-center p-0'
                />
            </div>
            <div className='default-wrapper' style={{ paddingTop: '0px' }}>
                <PickListPermissionAdmin id={id} />
            </div>
            <div
                className='default-wrapper'
                style={{ paddingTop: '0px', paddingBottom: '50px' }}
            >
                <PickListPermissionGroupAdmin id={id} />
            </div>
        </div>
    )
}

export default OrgSettings
