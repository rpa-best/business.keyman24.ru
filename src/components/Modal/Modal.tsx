'use client';

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import ExitSvg from '/public/svg/x.svg';
import { useModalStore } from 'store/modalVisibleStore';

import scss from './Modal.module.scss';
import { useNotificationStore } from 'store/notificationStore';
import { toast } from 'react-toastify';

interface ModalProps {
    children: React.ReactElement;
}

export const Modal: React.FC<ModalProps> = ({ children }) => {
    const [visible] = useModalStore((state) => [state.visible]);
    const [setVisible] = useModalStore((state) => [state.setVisible]);

    useEffect(() => {
        if (visible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [visible]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => {
                        setVisible(false);
                        toast.dismiss();
                    }}
                    className={scss.modal_background}
                >
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, transform: 'translateY(25%)' }}
                        animate={{ opacity: 1, transform: 'translateY(0)' }}
                        exit={{ opacity: 0, transform: 'translateY(25%)' }}
                        className={scss.modal}
                    >
                        <ExitSvg
                            onClick={() => {
                                setVisible(false);
                                toast.dismiss();
                            }}
                            className={scss.exit_svg}
                        />
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
