/* eslint-disable react/no-array-index-key */
/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
import React, { FC, useEffect, useRef, useState } from 'react'
import { Link, useLoaderData } from 'react-router-dom'
import { useTable } from 'react-table'
import '../../../assets/styles/scss/table.scss'
import useScanDetection from 'use-scan-detection'
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxHooks'
import { useFetchSessionElementQuery } from '../../../store/api/sessionElementApi'
import { sessionElementExport } from '../../../config/tableHeaders'
import Spinner from '../../Spinner/Spinner'
import SelectWorkers from '../../SelectWorkers'
import sessionSocketElement from '../../../helpers/sockets/sessionSocketElement'
import SelectOrgs from '../../SelectOrgs'
import InventoryBarcode from '../../Sections/InventoryBarcode'
import WorkerInfo from '../../Sections/WorkerInfo'
import TableSessionElement from '../TableSessionElement/TableSessionElement'
import '../../../assets/styles/scss/section.scss'
import sessionUseHelper from '../../../helpers/sessionUse/sessionUseHelper'
import socketSessionSecurityElement from '../../../helpers/sockets/socketSessionSecurityElement'
import WorkerInfoEmpty from '../../Sections/WorkerInfoEmpty'
import isValidWorker from '../../../helpers/isValidWorker'

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
        // workerId = 0,
        // workerOrgId = 0,
    } = props

    const title = 'Element'

    const [refetch, setRefetch] = useState<boolean>(false)
    const refetchElement = () => {
        setRefetch(prev => !prev)
    }

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
            params => {},
            data => setDataFromSocket(data),
        )

        return () => {
            // dispatchedThunk.abort()
            socket.current?.close()
        }
    }, [])

    useScanDetection({
        minLength: 12,
        onComplete: code => {
            // test()
            // console.log(code)
            // setBarcode(code)
            isValidWorker(dataFromSocket, () =>
                sessionUseHelper({
                    org: dataFromSocket.org,
                    area: areaId,
                    session: sessionId,
                    worker: dataFromSocket.worker,
                    barcode: code,
                    refetchElement,
                }),
            )
        },
    })

    return (
        // <h1 className='text-light'> Hello</h1>
        <>
            <div
                className='default-wrapper flex-row'
                style={{ paddingBottom: '0px', paddingRight: '30px' }}
            >
                <InventoryBarcode
                    org={orgId}
                    area={areaId}
                    session={sessionId}
                    worker={dataFromSocket.worker}
                    refetch={refetchElement}
                />
                {dataFromSocket.worker !== 0 && dataFromSocket.org !== 0 ? (
                    <WorkerInfo
                        org={dataFromSocket.org}
                        worker={dataFromSocket.worker}
                    />
                ) : (
                    <WorkerInfoEmpty />
                )}
            </div>
            <div
                className='d-flex h-100 flex-column'
                style={{ paddingBottom: '50px' }}
            >
                <TableSessionElement
                    sessionType='inventory'
                    refetch={refetch}
                />
            </div>
        </>
    )
}

const TableSessionElementInventory: FC<TableProps> = props => {
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

export default TableSessionElementInventory
