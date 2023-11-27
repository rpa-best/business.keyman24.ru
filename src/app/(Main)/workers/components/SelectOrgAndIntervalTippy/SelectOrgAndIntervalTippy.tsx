import React, { useEffect, useState } from 'react';
import { useSpring } from 'framer-motion';
import Tippy from '@tippyjs/react/headless';

import { IOrganization } from 'store/types';
import { onHide, onMount } from 'utils/TippyHelper';
import { OrgAndIntervalTIppy } from 'app/(Main)/workers/components/SelectOrgAndIntervalTippy/OrgAndIntervalTIppy';

import scss from './SelectOrgAndIntervalTippy.module.scss';
import { Button } from 'components/UI/Buttons/Button';
import { useResizeWidth } from 'hooks/useResizeWidth';

interface SelectOrgAndIntervalTippyProps {
    orgs: IOrganization[];
}

export const SelectOrgAndIntervalTippy: React.FC<
    SelectOrgAndIntervalTippyProps
> = ({ orgs }) => {
    const { tabletBreak } = useResizeWidth();
    const [visible, setVisible] = useState(false);
    const opacity = useSpring(0);

    const xOffset = tabletBreak ? 0 : 90;

    return (
        <div style={{ zIndex: 300 }} className={scss.tippy_wrapper}>
            <Tippy
                onMount={() => onMount(opacity)}
                onHide={({ unmount }) => onHide({ opacity, unmount })}
                animation={true}
                visible={visible}
                interactive={true}
                placement="left-start"
                offset={[40, xOffset]}
                render={() => (
                    <OrgAndIntervalTIppy
                        visible={visible}
                        setVisible={setVisible}
                        orgs={orgs}
                        opacity={opacity}
                    />
                )}
            >
                <div className={scss.time_management_button_wrapper}>
                    <Button onClick={() => setVisible(!visible)} type="button">
                        Учет времени
                    </Button>
                </div>
            </Tippy>
        </div>
    );
};
