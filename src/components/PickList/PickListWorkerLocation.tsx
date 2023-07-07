import React, { FC, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks'
import '../../assets/styles/scss/pickList.scss'
import {
    useDeleteWorkerNestedLocationMutation,
    useFetchWorkerNestedLocationQuery,
    useCreateWorkerNestedLocationMutation,
} from '../../store/api/workerNestedLocationApi'
import { IWorkerNestedLocation } from '../../models/workerNestedLocation'
import { workerReducer } from '../../store'
import PickList from './PickList'

interface PickListWorkerNestedLocationProps {
    locationId: number
    refetch: boolean
}

// IWorkerNestedLocation - selected
// IWorker - available

const PickListWorkerLocation: FC<PickListWorkerNestedLocationProps> = props => {
    const { locationId, refetch } = props
    const orgId = useAppSelector(state => state.org.currentOrg.id) || 0
    const dispatch = useAppDispatch()
    const fetchedWorkers = useAppSelector(state => state.worker.list)

    const {
        data: workerServerRes,
        isLoading: selectedLoading,
        isFetching: selectedFetching,
        refetch: refetchSelected,
    } = useFetchWorkerNestedLocationQuery({
        orgId,
        locationId,
    })
    const isLoading = {
        available: useAppSelector(state => state.worker.isLoading) === 'list',
        selected: selectedLoading || selectedFetching,
    }

    function contains(arr: IWorkerNestedLocation[], elem: any) {
        return arr.filter((i: any) => i.worker.id === elem.id).length === 0
    }

    const fetchedWorkerNestedLocation = workerServerRes?.results || []

    const selected = fetchedWorkerNestedLocation.map(worker => {
        return {
            ...worker,
            content: `${worker?.worker?.name}`,
        }
    })
    const [deleteOrg] = useDeleteWorkerNestedLocationMutation()
    const [createOrg] = useCreateWorkerNestedLocationMutation()

    const available = fetchedWorkers
        .map(worker => {
            return {
                ...worker,
                name: `${worker?.name}`,
                customDesc: `${worker?.org?.name}`,
            }
        })
        .filter(item => contains(selected, item))

    const handleRight = async (arr: any) => {
        const data = arr.map((item: any) => {
            return item.id
        })

        if (data.length !== 1) return

        // console.log(data)

        await createOrg({
            orgId,
            locationId,
            location: locationId,
            worker: data[0],
        }).unwrap()

        // refetchSelected()
    }

    const handleLeft = async (arr: any) => {
        const data = arr.map((item: any) => {
            return item.id
        })

        if (data.length !== 1) return

        await deleteOrg({
            orgId,
            locationId,
            location: locationId,
            worker: data[0],
        }).unwrap()

        // refetchSelected()
    }

    useEffect(() => {
        const dispatchedThunk = dispatch(
            workerReducer.fetchWithParams(),
        )
        refetchSelected()

        return () => {
            dispatchedThunk.abort()
        }
    }, [refetch])

    return (
        <PickList
            title='Настройка работников'
            selected={selected}
            available={available}
            handleArrowRight={handleRight}
            handleArrowLeft={handleLeft}
            isLoading={isLoading}
        />
    )
}

export default PickListWorkerLocation
