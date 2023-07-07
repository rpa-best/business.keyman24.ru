import { TypeEnum } from '../models/primitives'

export const modes: {
    mode: TypeEnum
    name: string
}[] = [
    { mode: TypeEnum.read, name: 'чтение' },
    { mode: TypeEnum.create, name: 'создание' },
    { mode: TypeEnum.update, name: 'обновление' },
    { mode: TypeEnum.delete, name: 'удаление' },
]

export const getModeName = (mode: TypeEnum) => {
    switch (mode) {
    case TypeEnum.read:
        return 'чтение'
    case TypeEnum.create:
        return 'создание'
    case TypeEnum.update:
        return 'обновление'
    case TypeEnum.delete:
        return 'удаление'
    default:
        return ''
    }
}
