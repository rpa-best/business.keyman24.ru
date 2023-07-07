import { PermissionEnum } from '../models/primitives'

const hasPermissionFromArray = (arr: PermissionEnum[], perm: PermissionEnum) => {
    return arr.filter(item => item === perm).length !== 0
}

export default hasPermissionFromArray
