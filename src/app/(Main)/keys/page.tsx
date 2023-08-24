import { KeysWrapper } from 'app/(Main)/keys/components/KeysWrapper';

import scss from './keys.module.scss';

const KeysPage = () => {
    return (
        <div className={scss.keys_children}>
            <h2 className={scss.page_title_with_table}>Добавить новые ключи</h2>
            <KeysWrapper />
        </div>
    );
};

export default KeysPage;
