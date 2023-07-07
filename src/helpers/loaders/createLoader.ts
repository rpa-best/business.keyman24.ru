const createLoader = async ({ request }: { request: any }) => {
    return {
        id: null,
        endpoint: request.url.split('/')[4],
        mode: 'create',
    }
}

export default createLoader
