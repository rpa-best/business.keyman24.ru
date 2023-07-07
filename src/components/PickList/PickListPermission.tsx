import React, { FC, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks'
import { permissionNestedReducer, permissionReducer } from '../../store'
import '../../assets/styles/scss/pickList.scss'
import { type IPermissionNested } from '../../models/permission'
import { getModeName, modes } from '../../helpers/modeHelper'
import PickList from './PickList'

interface PickListProps {
    id: number
}

// IPermissionNested - selected
// IPermission - available

const PickListPermission: FC<PickListProps> = props => {
    const { id } = props
    const dispatch = useAppDispatch()
    const isLoading = {
        available: useAppSelector(state => state.permission.isLoading) === 'list',
        selected:
            useAppSelector(
                state => state.permissionNestedPermissionGroup.isLoading,
            ) === 'list',
    }
    const fetchedPerms = useAppSelector(state => state.permission.list)
    const fetchedPermsNested = useAppSelector(
        state => state.permissionNestedPermissionGroup.list,
    )

    useEffect(() => {
        const dispatchedThunk1 = dispatch(permissionReducer.fetch())
        const dispatchedThunk2 = dispatch(
            permissionNestedReducer.fetchWithParamsNested({
                id,
                endpoint: 'permission',
            }),
        )

        return () => {
            dispatchedThunk1.abort()
            dispatchedThunk2.abort()
        }
    }, [dispatch, id, permissionReducer, permissionNestedReducer])

    const contains = (arr: IPermissionNested[], elem: any) => {
        return (
            arr.filter(i => i.permission.id === elem.id && i.type === elem.type)
                .length === 0
        )
    }

    const selected = fetchedPermsNested.map(perm => {
        return {
            ...perm,
            // content: `${perm.permission.name} ${perm.permission.slug} ${
            //     perm.permission.level
            // } ${getModeName(perm.type)}`,
            name: `${perm?.permission?.name} ( ${perm?.permission?.level?.name} )`,
            customDesc: getModeName(perm?.type),
        }
    })

    const available = fetchedPerms
        .map(perm => {
            return modes.map(mode => {
                return {
                    ...perm,
                    type: mode.mode,
                    // content: `${perm.name} ${perm.slug} ${perm.level} ${mode.name}`,
                    name: `${perm.name} ( ${perm.level.name} )`,
                    customDesc: mode.name,
                }
            })
        })
        .flat()
        .filter(item => contains(selected, item))

    const handleRight = (arr: any) => {
        const data = arr.map((item: any) => {
            return { type: item.type, permission: item.id, group: id }
        })

        if (data.length !== 1) return

        dispatch(
            permissionNestedReducer.createNested(data[0], {
                id,
                endpoint: 'permission',
            }),
        ).then(() =>
            dispatch(
                permissionNestedReducer.fetchWithParamsNested({
                    id,
                    endpoint: 'permission',
                }),
            ),
        )
    }

    const handleLeft = (arr: any) => {
        const data = arr.map((item: any) => {
            return item.id
        })

        if (data.length !== 1) return

        dispatch(
            permissionNestedReducer.deleteNested(data[0], {
                id,
                endpoint: 'permission',
            }),
        ).then(() =>
            dispatch(
                permissionNestedReducer.fetchWithParamsNested({
                    id,
                    endpoint: 'permission',
                }),
            ),
        )
    }

    return (
        <PickList
            title='Настройка прав'
            selected={selected}
            available={available}
            handleArrowRight={handleRight}
            handleArrowLeft={handleLeft}
            isLoading={isLoading}
        />
    )
}

export default PickListPermission
