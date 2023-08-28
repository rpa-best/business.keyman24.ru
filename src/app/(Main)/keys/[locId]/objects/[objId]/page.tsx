import React from 'react';

import { KeysWrapper } from 'app/(Main)/keys/components/KeysWrapper';

import scss from 'app/(Main)/keys/keys.module.scss';

const KeyPage = async () => {
    return (
        <div className={scss.children_with_table}>
            <h2 className={scss.page_title_with_table}>Сгенерировать ключи</h2>
            <KeysWrapper />
        </div>
    );
};

export default KeyPage;
