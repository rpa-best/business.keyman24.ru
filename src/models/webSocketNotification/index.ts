export interface IWebSocketNotificationData {
    // id: string
    slug: string
    name: string
    desc: string
    type: string
}

export interface IWebSocketNotification {
    type: 'info' | 'success' | 'error'
    data: any
}
