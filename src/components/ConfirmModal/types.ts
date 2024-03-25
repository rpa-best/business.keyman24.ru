export interface ConfirmModalProps {
    text: string;
    onConfirm: () => Promise<void>;
    afterConfirm: (d: any) => void;
    catchErrors: (e: any) => void;
}
