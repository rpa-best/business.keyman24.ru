import { AxiosResponse } from 'axios'
import $api from '../../http'
import { type ISessionElement } from '../../models/sessionElement'
import type IQueryParams from '../../models/IQueryParams'

interface FetchParams {
    orgId: number
    areaId: number
    sessionId: number
}

interface DefaultServerRes {
    count: number
    next: string
    previous: string
    next_offset: number
    previous_offset: number
    results: ISessionElement[]
}

export default class ElementNestedSessionService {
    static async fetchWithParams(
        data: FetchParams,
        params: IQueryParams,
        signal: AbortSignal,
    ): Promise<AxiosResponse<DefaultServerRes>> {
        return params.filter === undefined
            ? $api.get<DefaultServerRes>(
                `business/${data.orgId}/working_area/${data.areaId}/session/${data.sessionId}/element/?offset=${params.offset}&ordering=${params.orderBy}`,
                { signal },
            )
            : $api.get<DefaultServerRes>(
                `business/${data.orgId}/working_area/${data.areaId}/session/${data.sessionId}/element/?offset=${params.offset}&ordering=${params.orderBy}&${params.filter}`,
                { signal },
            )
    }
}
