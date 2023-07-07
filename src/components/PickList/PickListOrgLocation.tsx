import React, { FC, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks'
import '../../assets/styles/scss/pickList.scss'
import {
    useDeleteOrgNestedLocationMutation,
    useFetchOrgNestedLocationQuery,
    useCreateOrgNestedLocationMutation,
} from '../../store/api/orgNestedLocationApi'
import { useFetchOrgNestedOrgQuery } from '../../store/api/orgNestedOrgApi'
import { IOrgNestedLocation } from '../../models/orgNestedLocation'
import PickList from './PickList'

interface PickListOrgNestedLocationProps {
    locationId: number
    handleRefetch: () => void
}

// IOrgNestedLocation - selected
// IOrganization - available

const PickListOrgNestedLocation: FC<PickListOrgNestedLocationProps> = props => {
    const { locationId, handleRefetch } = props
    const orgId = useAppSelector(state => state.org.currentOrg.id) || 0
    const dispatch = useAppDispatch()

    const {
        data: fetchedOrgs = [],
        isLoading: availableLoading,
        isFetching: availableFetching,
        refetch: refetchAvailable,
    } = useFetchOrgNestedOrgQuery({
        orgId,
    })
    const {
        data: orgServerRes,
        isLoading: selectedLoading,
        isFetching: selectedFetching,
        refetch: refetchSelected,
    } = useFetchOrgNestedLocationQuery({
        orgId,
        locationId,
    })
    const isLoading = {
        available: availableLoading || availableFetching,
        selected: selectedLoading || selectedFetching,
    }

    function contains(arr: IOrgNestedLocation[], elem: any) {
        return arr.filter((i: any) => i.to_org.id === elem.id).length === 0
    }

    const fetchedOrgNestedLocation = orgServerRes?.results || []

    const selected = fetchedOrgNestedLocation.map(org => {
        return {
            ...org,
            content: `${org.to_org?.name}`,
        }
    })
    const [deleteOrg] = useDeleteOrgNestedLocationMutation()
    const [createOrg] = useCreateOrgNestedLocationMutation()

    const available = fetchedOrgs
        .map(org => {
            return {
                ...org,
                name: org?.name,
                customDesc: `ИНН: ${org?.inn}`,
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
            to_org: data[0],
        }).unwrap()

        handleRefetch()
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
            to_org: data[0],
        }).unwrap()

        handleRefetch()
        // refetchSelected()
    }

    // useEffect(() => {
    //     const dispatchedThunk = dispatch(
    //         permissionGroupReducer.fetchWithParams(),
    //     )

    //     return () => {
    //         dispatchedThunk.abort()
    //     }
    // }, [])

    return (
        <PickList
            title='Настройка организаций'
            selected={selected}
            available={available}
            handleArrowRight={handleRight}
            handleArrowLeft={handleLeft}
            isLoading={isLoading}
        />
    )
}

export default PickListOrgNestedLocation
