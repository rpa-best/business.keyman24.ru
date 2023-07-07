import React, { FC, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks'
import {
    permissionGroupAdminReducer,
    permissionGroupReducer,
} from '../../store'
import '../../assets/styles/scss/pickList.scss'
import { IPermissionGroupToAdmin } from '../../models/permission'
import { getModeName, modes } from '../../helpers/modeHelper'
import PickList from './PickList'

interface PickListProps {
    id: number
}

// IPermissionGroupToAdmin - selected
// IPermissionGroup - available

const PickListPermissionGroupAdmin: FC<PickListProps> = props => {
    const { id } = props
    const dispatch = useAppDispatch()
    const isLoading = {
        available:
            useAppSelector(state => state.permissionGroup.isLoading) === 'list',
        selected:
            useAppSelector(state => state.permissionGroupAdmin.isLoading) ===
            'list',
    }
    const fetchedPerms = useAppSelector(state => state.permissionGroup.list)
    const fetchedPermsNested = useAppSelector(
        state => state.permissionGroupAdmin.list,
    )

    useEffect(() => {
        const dispatchedThunk1 = dispatch(permissionGroupReducer.fetch())
        const dispatchedThunk2 = dispatch(
            permissionGroupAdminReducer.fetchWithParams(),
        )

        return () => {
            dispatchedThunk1.abort()
            dispatchedThunk2.abort()
        }
    }, [dispatch, id, permissionGroupReducer, permissionGroupAdminReducer])

    const contains = (arr: IPermissionGroupToAdmin[], elem: any) => {
        return arr.filter(i => i.group.id === elem.id).length === 0
    }

    const selected = fetchedPermsNested.map(perm => {
        return {
            ...perm,
            content: `${perm?.group?.name} ( ${perm?.group?.level?.name} )`,
        }
    })

    const available = fetchedPerms
        .map(group => {
            return {
                ...group,
                content: `${group?.name} ( ${group?.level?.name} )`,
            }
        })
        .filter(item => contains(selected, item))

    const handleRight = (arr: any) => {
        const data = arr.map((item: any) => {
            return { group: item.id, org: id }
        })

        if (data.length !== 1) return

        dispatch(permissionGroupAdminReducer.create(data[0])).then(() =>
            dispatch(permissionGroupAdminReducer.fetchWithParams()),
        )
    }

    const handleLeft = (arr: any) => {
        const data = arr.map((item: any) => {
            return item.id
        })

        if (data.length !== 1) return

        dispatch(permissionGroupAdminReducer.delete(data[0])).then(() =>
            dispatch(permissionGroupAdminReducer.fetchWithParams()),
        )
    }

    return (
        <PickList
            title='Настройка группы прав'
            selected={selected}
            available={available}
            handleArrowRight={handleRight}
            handleArrowLeft={handleLeft}
            isLoading={isLoading}
        />
    )
}

export default PickListPermissionGroupAdmin
