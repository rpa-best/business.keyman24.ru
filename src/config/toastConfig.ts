import { ToastOptions } from 'react-toastify';

export const errorToastOptions: ToastOptions = {
    position: 'bottom-right',
    hideProgressBar: true,
    autoClose: 2000,
    type: 'error',
    theme: 'colored',
};

export const successToastConfig: ToastOptions = {
    position: 'bottom-right',
    hideProgressBar: true,
    autoClose: 2000,
    type: 'success',
    theme: 'colored',
};

export const warningToastConfig: ToastOptions = {
    position: 'bottom-right',
    hideProgressBar: true,
    autoClose: 2000,
    type: 'warning',
    theme: 'colored',
};
export const priceToastConfig: ToastOptions = {
    position: 'top-right',
    autoClose: 5000,
    type: 'info',
};
