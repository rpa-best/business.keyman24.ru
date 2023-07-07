const getErrorMessage = (error: any): string | undefined => {
    return Array.isArray(error)
        ? error.reduce((acc, currValue) => `${acc} ${currValue?.desc}`, '')
        : error?.desc
}

export default getErrorMessage
