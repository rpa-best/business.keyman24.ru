const orgFromUrlLoader = async ({
    params,
    request,
}: {
    params: any
    request: any
    }) => {
    return {
        id: params.orgId,
        endpoint: request.url.split('/')[3],
    }
}

export default orgFromUrlLoader
