/* eslint-disable react/no-array-index-key */
/* eslint-disable react/require-default-props */
/* eslint-disable react/no-unused-prop-types */
import React, { FC, useEffect, useRef, useState } from 'react'
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
import TableSessionElement from '../TableSessionElement/TableSessionElement'
import WorkerInfoEmpty from '../../Sections/WorkerInfoEmpty'
import '../../../assets/styles/scss/section.scss'

interface TableProps {
    endpoint?: string
    sessionId?: number
    areaId?: number
    orgId?: number
}

const API_URL = 'wss://py.keyman24.ru/api/v1.1/business/ws/session/'

const Temp: FC<TableProps> = props => {
    const dispatch = useAppDispatch()
    const { endpoint = '', sessionId = 0, areaId = 0, orgId = 0 } = props

    const title = 'Element'
    const [currOrg, setCurrOrg] = useState<string | null>(null)
    const [currWorker, setCurrWorker] = useState<string | null>(null)
    const socket = useRef<WebSocket>()

    const [refetch, setRefetch] = useState<boolean>(false)
    const refetchElement = () => {
        setRefetch(prev => !prev)
    }

    useEffect(() => {
        // const dispatchedThunk = dispatch(fetchByIdOrg(id))

        socket.current = new WebSocket(
            `${API_URL}${sessionId}/?token=${localStorage.getItem(
                'token-access',
            )}`,
        )

        sessionSocketElement(
            socket.current,
            {
                org: Number(currOrg),
                area: areaId,
                session: sessionId,
                worker: Number(currWorker),
            },
            params => sessionUseHelper({ ...params, refetchElement }),
        )

        return () => {
            // dispatchedThunk.abort()
            socket.current?.close()
        }
    }, [currOrg, currWorker])

    return (
        // <h1 className='text-light'> Hello</h1>
        <>
            <div className='temp-select'>
                <SelectOrgs
                    currOrg={Number(currOrg)}
                    handleOrg={org => {
                        setCurrOrg(String(org))
                        setCurrWorker(null)
                    }}
                />
                {currOrg && (
                    <SelectWorkers
                        orgId={Number(currOrg)}
                        currWorker={Number(currWorker)}
                        handleWorker={e => setCurrWorker(e.toString())}
                    />
                )}
            </div>
            <div
                className='default-wrapper'
                style={{ paddingBottom: '0px', paddingRight: '30px' }}
            >
                {currWorker !== '' && currWorker !== null ? (
                    <WorkerInfo
                        org={Number(currOrg)}
                        worker={Number(currWorker)}
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
                    sessionType='register'
                    refetch={refetch}
                />
            </div>
        </>
    )
}

const TableSessionElementRegister: FC<TableProps> = props => {
    const loaderData: any = useLoaderData()

    const { extraId: sessionId, orgId, areaId } = loaderData
    return <Temp sessionId={sessionId} orgId={orgId} areaId={areaId} />
}

export default TableSessionElementRegister
