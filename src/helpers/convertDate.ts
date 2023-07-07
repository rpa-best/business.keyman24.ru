const convertDate = (date: string | null): string => {
    if (!date) {
        return ''
    }

    const parts = date.split('-')
    if (parts.length !== 3) {
        throw new Error('Неверный формат даты. Ожидается формат "yyyy-mm-dd".')
    }

    const year = parts[0]
    const month = parts[1]
    const day = parts[2]

    const formattedDate = `${day}.${month}.${year}`

    return formattedDate
}
export default convertDate
