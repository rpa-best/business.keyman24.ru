const editLoader = async ({
    params,
    request,
}: {
    params: any
    request: any
    }) => {
    return {
        id: params.id,
        endpoint: request.url.split('/')[4],
        mode: 'edit',
    }
}

export default editLoader
