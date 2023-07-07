import { boolean } from 'zod'
import { useMemo } from 'react'
import { PermissionEnum } from '../models/primitives'
import getEntity, { IEntityButtons } from './fixMe'

const validateButtons = (
    buttons: IEntityButtons,
    permissions: PermissionEnum[],
): IEntityButtons => {
    const validate = () => {
        const actions: Record<string, (obj: IEntityButtons) => boolean> = {
            read: obj => permissions.includes(PermissionEnum.get),
            add: obj => permissions.includes(PermissionEnum.post),
            edit: obj => permissions.includes(PermissionEnum.patch),
            delete: obj => permissions.includes(PermissionEnum.delete),
        }

        const result: IEntityButtons = {}

        Object.keys(buttons).forEach(button => {
            if (buttons[button] !== undefined) {
                if (['dropdown', 'request', 'nested'].includes(button)) {
                    result[button] = buttons[button]
                } else if (actions[button]) {
                    result[button] = actions[button](buttons)
                }
            }
        })

        // console.log(result)

        return result
    }

    return useMemo(() => validate(), [buttons, permissions]);
}

// const validateButtons = (
//     buttons: IEntityButtons,
//     permissions: PermissionEnum[],
// ): IEntityButtons => {
//     const actions: Record<string, (obj: IEntityButtons) => boolean> = {
//         read: obj => permissions.includes(PermissionEnum.get),
//         add: obj => permissions.includes(PermissionEnum.post),
//         edit: obj => permissions.includes(PermissionEnum.patch),
//         delete: obj => permissions.includes(PermissionEnum.delete),
//     }

//     const result: IEntityButtons = {}

//     Object.keys(buttons).forEach(button => {
//         if (buttons[button] !== undefined) {
//             if (['dropdown', 'request', 'nested'].includes(button)) {
//                 result[button] = buttons[button]
//             } else if (actions[button]) {
//                 result[button] = actions[button](buttons)
//             }
//         }
//     })

//     console.log(result)

//     return result
// }

export default validateButtons
