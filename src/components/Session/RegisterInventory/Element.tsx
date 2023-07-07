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
        workerOrgId = 0,
    } = props

    const title = 'Element'

    const [refetch, setRefetch] = useState<boolean>(false)
    const refetchElement = () => {
        setRefetch(prev => !prev)
    }

    useScanDetection({
        minLength: 12,
        onComplete: code => {
            sessionUseHelper({
                org: orgId,
                area: areaId,
                session: sessionId,
                worker: workerId,
                barcode: code,
                refetchElement,
            })
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
                    worker={Number(workerId)}
                    refetch={refetchElement}
                />
                <WorkerInfo org={workerOrgId} worker={workerId} />
            </div>
            <div
                className='d-flex h-100 flex-column'
                style={{ paddingBottom: '50px' }}
            >
                <TableSessionElement
                    sessionType='register_inventory'
                    refetch={refetch}
                />
            </div>
        </>
    )
}

const TableSessionElementRegisterInventory: FC<TableProps> = props => {
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

export default TableSessionElementRegisterInventory
