import React from 'react';

import scss from './Notification.module.scss';

interface NotificationProps {
    status: string;
}

export const Notification: React.FC<NotificationProps> = ({ status }) => {
    return (
        <div className={scss.notification_body}>
            <div className={scss.notification}>
                <h2 className={scss.notification_status}>
                    Статус вашей заявки: {status}
                </h2>
                <p className={scss.notification_desc}>
                    По всем вопросам обращайтесь по номеру:
                </p>
                <p className={scss.notification_desc}>+7........</p>
            </div>
        </div>
    );
};
