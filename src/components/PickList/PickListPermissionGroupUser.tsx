import React, { FC, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks'
import { permissionGroupReducer } from '../../store'
import '../../assets/styles/scss/pickList.scss'
import { type IPermissionGroupUser } from '../../models/permission'
import {
    useCreatePermissionGroupUserMutation,
    useDeletePermissionGroupUserMutation,
    useFetchPermissionGroupUserQuery,
} from '../../store/api/permissionGroupUserApi'
import PickList from './PickList'

interface PickListPermissionGroupUserProps {
    username: string
}

// IPermissionGroupUser - selected
// IPermissionGroup - available

const PickListPermissionGroupUser: FC<
    PickListPermissionGroupUserProps
> = props => {
    const { username } = props
    const orgId = Number(localStorage.getItem('currOrg'))
    const dispatch = useAppDispatch()

    const fetchedGroups = useAppSelector(state => state.permissionGroup.list)
    const {
        data: fetchedPermsGroupUserNested = [],
        isLoading: selectedLoading,
        isFetching: selectedFetching,
        refetch: refetchSelected,
    } = useFetchPermissionGroupUserQuery({
        orgId,
        username,
    })
    const isLoading = {
        available:
            useAppSelector(state => state.permissionGroup.isLoading) === 'list',
        selected: selectedLoading || selectedFetching,
    }

    function contains(arr: IPermissionGroupUser[], elem: any) {
        return arr.filter((i: any) => i.group.id === elem.id).length === 0
    }

    const selected = fetchedPermsGroupUserNested.map(group => {
        return {
            ...group,
            content: `${group.group?.name}`,
        }
    })
    const [deletePerm] = useDeletePermissionGroupUserMutation()
    const [createPerm] = useCreatePermissionGroupUserMutation()

    const available = fetchedGroups
        .map(group => {
            return {
                ...group,
                content: `${group?.name} ( ${group?.level?.name} )`,
            }
        })
        .filter(item => contains(selected, item))

    const handleRight = async (arr: any) => {
        const data = arr.map((item: any) => {
            return item.id
        })

        if (data.length !== 1) return

        // console.log(data)

        await createPerm({
            orgId,
            username,
            group: data[0],
        }).unwrap()

        // refetchSelected()
    }

    const handleLeft = async (arr: any) => {
        const data = arr.map((item: any) => {
            return item.id
        })

        if (data.length !== 1) return

        await deletePerm({
            orgId,
            username,
            group: data[0],
        }).unwrap()

        // refetchSelected()
    }

    useEffect(() => {
        const dispatchedThunk = dispatch(
            permissionGroupReducer.fetchWithParams(),
        )

        return () => {
            dispatchedThunk.abort()
        }
    }, [])

    return (
        <PickList
            title='Настройка группы прав'
            selected={selected}
            available={available}
            handleArrowRight={handleRight}
            handleArrowLeft={handleLeft}
            isLoading={isLoading}
            useMinimize
        />
    )
}

export default PickListPermissionGroupUser
