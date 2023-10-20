export const deleteSearchParams = (
    name: string,
    searchParams: URLSearchParams['entries']
) => {
    const urlSearchParams = new URLSearchParams(Array.from(searchParams()));

    urlSearchParams.delete(name);

    return urlSearchParams;
};
