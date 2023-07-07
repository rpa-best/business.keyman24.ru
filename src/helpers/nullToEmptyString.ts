const nullToEmptyString = (value: string | null | undefined): string => {
    return (value === null || value === undefined) ? '' : value
}

export default nullToEmptyString
