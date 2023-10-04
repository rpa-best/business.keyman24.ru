'use client';

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useNotificationStore } from 'store/notificationStore';
import { useResizeWidth } from 'hooks/useResizeWidth';
import ExitSvg from '/public/svg/x.svg';

import scss from './Notification.module.scss';
import { useModalStore } from 'store/modalVisibleStore';
import { useConstructorStore } from 'store/useConstructorStore';

interface NotificationToast {
    children: React.ReactElement;
    syncWithModal?: boolean;
}

export const NotificationToast: React.FC<NotificationToast> = ({
    children,
    syncWithModal,
}) => {
    const [fields] = useConstructorStore((state) => [state.fields]);
    const { phoneBreak } = useResizeWidth();
    const [modalVisible] = useModalStore((state) => [state.visible]);
    const [visible] = useNotificationStore((state) => [state.visible]);
    const [setVisible] = useNotificationStore((state) => [state.setVisible]);

    useEffect(() => {
        if (syncWithModal) {
            if (modalVisible) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        }
    }, [modalVisible, setVisible, syncWithModal, visible]);

    if (fields?.length || !fields) {
        return null;
    }

    return (
        <AnimatePresence>
            {visible && (
                /*<motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() =>
                        preventClickOutside ? '' : setVisible(false)
                    }
                    className={scss.modal_background}
                >*/
                <motion.div
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, y: phoneBreak ? '5%' : '15%' }}
                    animate={{
                        opacity: 1,
                        y: phoneBreak ? '-10%' : '-15%',
                    }}
                    exit={{ opacity: 0, y: '-15%' }}
                    className={scss.modal}
                >
                    <ExitSvg
                        onClick={() => setVisible(false)}
                        className={scss.exit_svg}
                    />
                    {children}
                </motion.div>
                /* </motion.div>*/
            )}
        </AnimatePresence>
    );
};
