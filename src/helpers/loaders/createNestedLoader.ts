const createNestedLoader = async ({
    params,
    request,
}: {
    params: any
    request: any
}) => {
    return {
        id: params.id,
        endpointOriginal: request.url.split('/')[4],
        endpointNested: request.url.split('/')[7],
        mode: 'create',
    }
}

export default createNestedLoader
