const sessionElementLoader = async ({
    params,
    request,
}: {
    params: any
    request: any
}) => {
    const url = request.url.split('/')
    // console.log('endpointOriginal', url[4])
    // console.log('endpointNested', url[7])
    // console.log(params.extraId)
    // console.log(params.id)

    return {
        endpointOriginal: url[4],
        endpointNested: url[7],
        orgId: params.orgId,
        areaId: params.id,
        extraId: params.extraId,
    }
}

export default sessionElementLoader
