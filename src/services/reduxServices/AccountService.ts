import { AxiosResponse } from 'axios';
import $api from '../../http';
import { IAuthRequest, IAuthResponse } from '../../models/accountAuth';
import { IAccountDetail } from '../../models/accountDetail';

export default class AccountService {
    static async auth(body: IAuthRequest): Promise<AxiosResponse<IAuthResponse>> {
        return $api.post<IAuthResponse>('account/auth/?login_params=username_password', body);
    }

    static async me(signal: AbortSignal): Promise<AxiosResponse<IAccountDetail>> {
        return $api.get<IAccountDetail>('account/me/', { signal });
    }
}
