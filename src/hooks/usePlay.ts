import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { StatusEnum } from '../models/primitives'

interface PlayProps {
    callback: () => void
    params: {
        orgId: number
        areaId: number
        sessionId: number
        status: StatusEnum
    }
}

const usePlay = () => {
    const navigate = useNavigate()

    const handlePlayClick = useCallback((props: PlayProps) => {
        const { callback, params } = props

        if (params.status === StatusEnum.valid) {
            callback()
        } else {
            navigate(
                `/${params.orgId}/working-area/${params.areaId}/edit/session/${params.sessionId}/element/`,
            )
        }
    }, [])

    return handlePlayClick
}

export default usePlay
