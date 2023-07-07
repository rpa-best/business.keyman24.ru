const tableLoader = async ({
    // params,
    request,
}: {
    // params: any
    request: any
}) => {
    return {
        // id: params.id,
        endpoint: request.url.split('/')[4],
        mode: 'list',
    }
}

export default tableLoader
