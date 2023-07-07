export interface SelectOptions {
    value: string | number
    label: string
}

const getOptionsByArray = (
    arr: Array<any>,
    valueKey: string,
    labelKey: string,
): SelectOptions[] => {
    return arr.map((item: any) => ({
        value: item[valueKey],
        label: item[labelKey],
    }))
}

export default getOptionsByArray
