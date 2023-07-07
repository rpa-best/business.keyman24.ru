const tableByEndpointLoader = async ({
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
        endpoint: `${url[7]}-nested-${url[4]}`,
        mode: 'list',
    }
}

export default tableByEndpointLoader
