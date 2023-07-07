/* eslint-disable react/no-array-index-key */
/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
import React, {
    FC, useEffect, useRef, useState,
} from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { useTable } from 'react-table'
import '../../../assets/styles/scss/table.scss'
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxHooks'
import { useFetchSessionElementQuery } from '../../../store/api/sessionElementApi'
import {
    sessionElementExport,
    sessionRegisterElementExport,
} from '../../../config/tableHeaders'
import Spinner from '../../Spinner/Spinner'
import SelectWorkers from '../../SelectWorkers'
import sessionSocketElement from '../../../helpers/sockets/sessionSocketElement'
import SelectOrgs from '../../SelectOrgs'
import sessionUseHelper from '../../../helpers/sessionUse/sessionUseHelper'
import WorkerInfo from '../../Sections/WorkerInfo'
import socketSessionSecurityElement from '../../../helpers/sockets/socketSessionSecurityElement'
import TableSessionElement from '../TableSessionElement/TableSessionElement'
import WorkerInfoEmpty from '../../Sections/WorkerInfoEmpty'
import '../../../assets/styles/scss/section.scss'

interface TableProps {
    endpoint?: string
    sessionId?: number
    areaId?: number
    orgId?: number
    workerId?: number
    workerOrgId?: number
}

const API_URL = 'wss://py.keyman24.ru/api/v1.1/business/ws/session/'

const Temp: FC<TableProps> = props => {
    const dispatch = useAppDispatch()
    const {
        endpoint = '',
        sessionId = 0,
        areaId = 0,
        orgId = 0,
        workerId = 0,
        // workerOrgId = 0,
    } = props

    const [refetch, setRefetch] = useState<boolean>(false)
    const refetchElement = () => {
        setRefetch(prev => !prev)
    }

    const title = 'Element'
    const socket = useRef<WebSocket>()

    const [dataFromSocket, setDataFromSocket] = useState({
        worker: 0,
        org: 0,
    })

    useEffect(() => {
        // const dispatchedThunk = dispatch(fetchByIdOrg(id))

        socket.current = new WebSocket(
            `${API_URL}${sessionId}/?token=${localStorage.getItem(
                'token-access',
            )}`,
        )

        socketSessionSecurityElement(
            socket.current,
            {
                org: orgId,
                area: areaId,
                session: sessionId,
                // worker: workerId,
            },
            params => sessionUseHelper({ ...params, refetchElement }),
            data => setDataFromSocket(data),
        )

        return () => {
            // dispatchedThunk.abort()
            socket.current?.close()
        }
    }, [])

    return (
        <>
            {/* {dataFromSocket.worker !== 0 && dataFromSocket.org !== 0 ? (
                <WorkerInfo
                    org={dataFromSocket.org}
                    worker={dataFromSocket.worker}
                />
            ) : (
                <WorkerInfoEmpty />
            )} */}
            <div
                className='default-wrapper'
                style={{ paddingBottom: '0px', paddingRight: '30px' }}
            >
                {dataFromSocket.worker !== 0 && dataFromSocket.org !== 0 ? (
                    <WorkerInfo
                        org={dataFromSocket.org}
                        worker={dataFromSocket.worker}
                    />
                ) : (
                    <WorkerInfoEmpty />
                )}
            </div>
            {/* <div
                className='default-wrapper'
                style={{ paddingBottom: '0px', paddingRight: '120px' }}
            >
                <WorkerInfo
                    org={dataFromSocket.org}
                    worker={dataFromSocket.worker}
                />
            </div> */}
            <div
                className='d-flex h-100 flex-column'
                style={{ paddingBottom: '50px' }}
            >
                <TableSessionElement
                    sessionType='security'
                    refetch={refetch}
                />
            </div>
        </>
    )
}

const TableSessionElementSecurity: FC<TableProps> = props => {
    const loaderData: any = useLoaderData()

    const {
        extraId: sessionId,
        orgId,
        areaId,
        workerId,
        workerOrgId,
    } = loaderData
    return (
        <Temp
            sessionId={sessionId}
            orgId={orgId}
            areaId={areaId}
            workerId={workerId}
            workerOrgId={workerOrgId}
        />
    )
}

export default TableSessionElementSecurity
