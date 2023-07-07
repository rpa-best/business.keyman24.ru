import React, { FC, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks'
import { deviceReducer } from '../../store'
import '../../assets/styles/scss/pickList.scss'
import { type IDeviceNestedWorkingArea } from '../../models/deviceNestedWorkingArea'
import {
    useCreateDeviceNestedWorkingAreaMutation,
    useDeleteDeviceNestedWorkingAreaMutation,
    useFetchDeviceNestedWorkingAreaQuery,
} from '../../store/api/deviceNestedWorkingAreaApi'
import PickList from './PickList'

interface PickListDeviceNestedWorkingAreaProps {
    workingAreaId: number
}

// IDeviceNestedWorkingArea - selected
// IDevice - available

const PickListDevice: FC<PickListDeviceNestedWorkingAreaProps> = props => {
    const { workingAreaId } = props
    const orgId = Number(localStorage.getItem('currOrg'))
    const dispatch = useAppDispatch()

    const fetchedDevices = useAppSelector(state => state.device.list)
    const {
        data: serverRes,
        isLoading: selectedLoading,
        isFetching: selectedFetching,
    } = useFetchDeviceNestedWorkingAreaQuery({
        orgId,
        workingAreaId,
    })
    const isLoading = {
        available: useAppSelector(state => state.device.isLoading) === 'list',
        selected: selectedLoading || selectedFetching,
    }

    function contains(arr: IDeviceNestedWorkingArea[], elem: any) {
        return arr.filter((i: any) => i.device === elem.id).length === 0
    }

    const fetchedDevicesNestedWorkingArea = serverRes?.results || []

    const selected = fetchedDevicesNestedWorkingArea.map(device => {
        return {
            ...device,
            // content: `${device.device.name} ( ${device.device.type} )`,
            name: `${device.device.name} ( ${device.device.type} )`,
            customDesc: device.device.desc,
        }
    })
    const [deleteDevice] = useDeleteDeviceNestedWorkingAreaMutation()
    const [createDevice] = useCreateDeviceNestedWorkingAreaMutation()

    const available = fetchedDevices.map(device => {
        return {
            ...device,
            // content: `${device.name} ( ${device.type} )`,
            name: `${device.name} ( ${device.type} )`,
            customDesc: device.desc,
        }
    })
    // .filter(item => contains(selected, item))

    const handleRight = async (arr: any) => {
        const data = arr.map((item: any) => {
            return item.id
        })

        if (data.length !== 1) return

        // console.log(data)

        await createDevice({
            orgId,
            workingAreaId,
            deviceId: data[0],
        }).unwrap()

        dispatch(
            deviceReducer.fetchWithParams({
                filter: 'place=working_area',
            }),
        )

        // refetchSelected()
    }

    const handleLeft = async (arr: any) => {
        const data = arr.map((item: any) => {
            return item.id
        })

        if (data.length !== 1) return

        await deleteDevice({
            orgId,
            workingAreaId,
            deviceId: data[0],
        }).unwrap()

        dispatch(
            deviceReducer.fetchWithParams({
                filter: 'place=working_area',
            }),
        )

        // refetchSelected()
    }

    useEffect(() => {
        const dispatchedThunk = dispatch(
            deviceReducer.fetchWithParams({
                filter: 'place=working_area',
            }),
        )

        return () => {
            dispatchedThunk.abort()
        }
    }, [])

    return (
        <PickList
            title='Настройка устройств'
            selected={selected}
            available={available}
            handleArrowRight={handleRight}
            handleArrowLeft={handleLeft}
            isLoading={isLoading}
        />
    )
}

export default PickListDevice
