import React, { FC, useEffect, useState } from 'react'
import Select from 'react-select/async'
import nullToEmptyString from '../helpers/nullToEmptyString'
import getOptionsByArray, {
    type SelectOptions,
} from '../helpers/getOptionsByArray'
import { useAppDispatch, useAppSelector } from '../hooks/useReduxHooks'
import { selectStyles, themeUnset } from '../config/selectStyles'
import { workerReducer } from '../store'
import { useFetchWorkerNestedElementQuery } from '../store/api/workerNestedElementApi'
import {
    fetchByNameWorker,
    fetchWorker,
} from '../store/slices/workerNestedElementSlice'

interface SelectWorkersProps {
    orgId: number
    currWorker: number
    handleWorker: (worker: number) => void
}

const SelectWorkers: FC<SelectWorkersProps> = props => {
    const { orgId, currWorker, handleWorker } = props
    const { list: fetchedWorkers, isLoading } = useAppSelector(
        state => state.workerNestedElement,
    )
    const workers = getOptionsByArray(fetchedWorkers, 'id', 'name')
    const dispatch = useAppDispatch()

    const filterWorkers = (inputValue: string): SelectOptions[] => {
        return fetchedWorkers.map(item => {
            return {
                value: item.id,
                label: nullToEmptyString(item.name),
            }
        })
    }

    const loadWorkers = (
        inputValue: string,
        callback: (options: SelectOptions[]) => void,
    ) => {
        setTimeout(() => {
            if (inputValue) {
                dispatch(fetchByNameWorker({ orgId, name: inputValue }))
                callback(filterWorkers(inputValue))
            }
        }, 500)
    }

    const rawWorker = workers.find(option => option.value === currWorker)
    const temp = rawWorker || ({} as any)

    useEffect(() => {
        const dispatchedThunk1 = dispatch(fetchWorker({ orgId }))
        return () => {
            dispatchedThunk1.abort()
        }
    }, [orgId])

    return (
        <div className='select-wrapper'>
            <Select
                placeholder='выберите работника'
                noOptionsMessage={() => 'name not found'}
                onChange={e => handleWorker(e.value)}
                styles={selectStyles}
                loadOptions={loadWorkers}
                isLoading={isLoading === 'list'}
                defaultOptions={workers}
                value={rawWorker === undefined ? null : temp}
                theme={(defTheme: any) => themeUnset(defTheme)}
                className='header-select'
            />
        </div>
    )
}

export default SelectWorkers
