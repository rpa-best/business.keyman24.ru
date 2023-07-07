import React, { FC, useState } from 'react'
import '../assets/styles/scss/mainPage.scss'
// import useScanDetection from 'use-scan-detection'
import { useAppSelector } from '../hooks/useReduxHooks'
import TestHeaders from '../components/Sections/TestHeaders'
import Card from '../components/Card'
import { ReactComponent as SVGUsers } from '../assets/img/main/users.svg'
import { ReactComponent as SVGKey } from '../assets/img/main/key.svg'
import { ReactComponent as SVGBriefcase } from '../assets/img/main/briefcase.svg'

const MainPageOrgSelected: FC = () => {
    const currentOrg = useAppSelector(state => state.org.currentOrg)
    // const [barcode, setBarcode] = useState<any>(null)

    // useScanDetection({
    //     onComplete: (code) => {
    //         setBarcode(code)
    //     },
    // })

    return (
        <div className='home-wrapper'>
            <h1 className='home-header'>Главное меню</h1>
            <div className='short-info-wrapper'>
                <Card title='Ключи' current={3} total={40} Icon={SVGKey} />
                <Card
                    title='Мат. ценности'
                    current={2}
                    total={20}
                    Icon={SVGBriefcase}
                />
                <Card
                    title='Сотрудники'
                    current={6}
                    total={30}
                    Icon={SVGUsers}
                />
            </div>
        </div>
    )
}

export default MainPageOrgSelected
