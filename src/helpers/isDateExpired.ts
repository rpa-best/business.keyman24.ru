const isDateExpired = (dateString: string | null): boolean => {
    if (!dateString) return false

    const currentDate = new Date()
    const inputDate = new Date(dateString)

    return inputDate < currentDate
}

export default isDateExpired
