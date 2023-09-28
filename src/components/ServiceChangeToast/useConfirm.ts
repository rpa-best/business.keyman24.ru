import { useNotificationStore } from 'store/notificationStore';
import { useEffect, useState } from 'react';

export const useConfirm = () => {
    const [confirm, setConfirm] = useState(false);

    return [confirm];
};
