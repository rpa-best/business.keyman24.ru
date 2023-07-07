const editNestedLoader = async ({
    params,
    request,
}: {
    params: any
    request: any
}) => {
    const url = request.url.split('/')

    return {
        id: params.id,
        endpointOriginal: url[4],
        endpointNested: url[7],
        extraId: url[8],
        mode: 'edit',
    }
}

export default editNestedLoader
