const orgSettingsLoader = async ({
    params,
    request,
}: {
    params: any
    request: any
}) => {
    return {
        id: params.orgId,
    }
}

export default orgSettingsLoader
