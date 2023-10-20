export const setSearchParams = (
    name: string,
    value: string,
    searchParams: URLSearchParams['entries']
) => {
    const urlSearchParams = new URLSearchParams(Array.from(searchParams()));

    urlSearchParams.set(name, value);

    return urlSearchParams;
};
