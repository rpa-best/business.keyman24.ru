type ModeType = 'read' | 'create' | 'update' | 'delete';

export const modes: {
    mode: ModeType;
    name: string;
}[] = [
    { mode: 'read', name: 'чтение' },
    { mode: 'create', name: 'создание' },
    { mode: 'update', name: 'обновление' },
    { mode: 'delete', name: 'удаление' },
];

export const getModeName = (mode: ModeType) => {
    switch (mode) {
        case 'read':
            return 'чтение';
        case 'create':
            return 'создание';
        case 'update':
            return 'обновление';
        case 'delete':
            return 'удаление';
        default:
            return '';
    }
};
