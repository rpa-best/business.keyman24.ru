import IEntityByKey from './IEntityByKey'

export interface IFormData<T> {
    formTitle: string
    buttonTitle: string
    data: T
    // buttonAction: () => void
}

export interface IDataByMode<T> extends IEntityByKey<IFormData<T>> {
    edit: IFormData<T>
    create: IFormData<T>
}
