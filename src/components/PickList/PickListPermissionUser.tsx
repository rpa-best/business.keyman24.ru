import React, { FC, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks'
import { permissionReducer } from '../../store'
import '../../assets/styles/scss/pickList.scss'
import { type IPermissionUser } from '../../models/permission'
import {
    useCreatePermissionUserMutation,
    useDeletePermissionUserMutation,
    useFetchPermissionUserQuery,
} from '../../store/api/permissionUserApi'
import Spinner from '../Spinner/Spinner'
import { getModeName, modes } from '../../helpers/modeHelper'
import PickList from './PickList'

interface PickListPermissionUserProps {
    username: string
}

// IPermissionUser - selected
// IPermission - available

const PickListPermissionUser: FC<PickListPermissionUserProps> = props => {
    const { username } = props
    const orgId = Number(localStorage.getItem('currOrg'))
    const dispatch = useAppDispatch()

    const fetchedPerms = useAppSelector(state => state.permission.list)
    const {
        data: fetchedPermsUserNested = [],
        isLoading: selectedLoading,
        isFetching: selectedFetching,
        refetch: refetchSelected,
    } = useFetchPermissionUserQuery({
        orgId,
        username,
    })

    const isLoading = {
        available: useAppSelector(state => state.permission.isLoading) === 'list',
        selected: selectedLoading || selectedFetching,
    }

    useEffect(() => {
        const dispatchedThunk1 = dispatch(permissionReducer.fetch())

        return () => {
            dispatchedThunk1.abort()
        }
    }, [dispatch, permissionReducer])

    const contains = (arr: IPermissionUser[], elem: any) => {
        return (
            arr.filter(i => i.permission.id === elem.id && i.type === elem.type)
                .length === 0
        )
    }

    const selected = fetchedPermsUserNested.map(perm => {
        return {
            ...perm,
            name: `${perm?.permission?.name} ( ${perm?.permission?.level?.name} )`,
            customDesc: getModeName(perm?.type),
        }
    })
    const [deletePerm] = useDeletePermissionUserMutation()
    const [createPerm] = useCreatePermissionUserMutation()

    const available = fetchedPerms
        .map(perm => {
            return modes.map(mode => {
                return {
                    ...perm,
                    type: mode.mode,
                    name: `${perm?.name} ( ${perm?.level?.name} )`,
                    customDesc: mode.name,
                }
            })
        })
        .flat()
        .filter(item => contains(selected, item))

    const handleRight = async (arr: any) => {
        const data = arr.map((item: any) => {
            return { type: item.type, permission: item.id }
        })

        if (data.length !== 1) return

        await createPerm({
            orgId,
            username,
            permission: data[0].permission,
            type: data[0].type,
        }).unwrap()
    }

    const handleLeft = async (arr: any) => {
        const data = arr.map((item: any) => {
            return item.id
        })

        if (data.length !== 1) return

        await deletePerm({
            orgId,
            username,
            permission: data[0],
        }).unwrap()
    }

    return (
        <PickList
            title='Настройка прав пользователя'
            selected={selected}
            available={available}
            handleArrowRight={handleRight}
            handleArrowLeft={handleLeft}
            isLoading={isLoading}
            useMinimize
        />
    )
}

export default PickListPermissionUser
