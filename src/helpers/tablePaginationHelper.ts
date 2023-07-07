const pagesLength = (totalItems: number) => {
    return Math.ceil(totalItems / 10)
}

const currentOffset = (pagesCount: number) => {
    return (pagesCount - 1) * 10
}

const currentPageByOffset = (offset: number) => {
    return (offset / 10) + 1
}

export {
    pagesLength,
    currentOffset,
    currentPageByOffset,
}
