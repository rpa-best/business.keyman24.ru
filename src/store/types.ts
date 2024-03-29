import { SocketResponse } from 'http/types';

export interface IUser {
    username: string;
    name: string | null;
    surname: string | null;
    lastname: string | null;
    email: string | null;
    phone: string | null;
    birthday: Date | null;
    gender: string | null;
    bio: string | null;
    avatar: string;
    qrcode: string;
    isActiveuser: boolean;
    hasBusiness: boolean;
    isAuth: boolean;
}

export type SetUserType = (data: IUser) => void;

export type LogoutUserType = () => void;

export interface IUserStore {
    user: IUser | null;
    isAuth: boolean;
    setUser: SetUserType;
    setLogoutUser: LogoutUserType;
}

export interface ISocketStore {
    socket: WebSocket | null;
    createConnection: (sessionId: number, access: string) => void;
    closeConnection: () => void;
    onClose: (cb: () => void) => void;
    message: SocketResponse | null;
}

export interface IModalStore {
    visible: boolean;
    setVisible: (v: boolean) => void;
}

export interface INotificationStore extends IModalStore {}

interface IRegionType {
    id: number;
    name: string;
}

export interface IRegion {
    id: number;
    type: IRegionType;
    name: string;
    status: boolean;
    parent: number | null;
}
export interface IOrganization {
    id: number;
    region: IRegion;
    name: string;
    prime: boolean;
    createAt: string;
    lcId: number | null;
    inn: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    balance: number;
}

export type SetOrganizationType = (data: IOrganization) => void;

export interface IOrganizationStore {
    organization: IOrganization | null;
    setOrganization: SetOrganizationType;
}
