'use client';

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import ExitSvg from '/public/svg/x.svg';
import { useModalStore } from 'store/modalVisibleStore';

import scss from './Modal.module.scss';
import { useNotificationStore } from 'store/notificationStore';
import { toast } from 'react-toastify';

interface ModalProps {
    customVisible?: boolean;
    customSetVisible?: (b: boolean) => void;
    children: React.ReactElement;
}

export const Modal: React.FC<ModalProps> = ({
    customVisible,
    customSetVisible,
    children,
}) => {
    const [visible] = useModalStore((state) => [state.visible]);
    const [setVisible] = useModalStore((state) => [state.setVisible]);

    const currentVisible = customVisible ?? visible;

    useEffect(() => {
        if (visible || customVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [customVisible, visible]);

    const handleHide = () => {
        if (customVisible) {
            if (customSetVisible) {
                customSetVisible(false);
            }
        } else {
            setVisible(false);
        }
        toast.dismiss();
    };

    return (
        <AnimatePresence>
            {currentVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => {
                        handleHide();
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
                                handleHide();
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
