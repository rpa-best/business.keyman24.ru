'use client';

import React from 'react';
import { shallow } from 'zustand/shallow';
import { AnimatePresence, motion } from 'framer-motion';

import ExitSvg from '/public/svg/x.svg';
import { useModalStore } from 'store/modalVisibleStore';

import scss from './Modal.module.scss';

interface ModalProps {
    children: React.ReactElement;
}

export const Modal: React.FC<ModalProps> = ({ children }) => {
    const [visible, setVisible] = useModalStore(
        (state) => [state.visible, state.setVisible],
        shallow
    );

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setVisible(false)}
                    className={scss.modal_background}
                >
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, transform: 'translateY(25%)' }}
                        animate={{ opacity: 1, transform: 'translateY(0)' }}
                        className={scss.modal}
                    >
                        <ExitSvg
                            onClick={() => setVisible(false)}
                            className={scss.exit_svg}
                        />
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
