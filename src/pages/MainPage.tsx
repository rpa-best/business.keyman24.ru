import React, { FC } from 'react'
import '../assets/styles/scss/mainPage.scss'
// import Card from '../components/Card'
import SVGUsers from '../assets/img/main/users.svg'
import SVGKey from '../assets/img/main/key.svg'
import SVGBriefcase from '../assets/img/main/briefcase.svg'
import InlineSpinner from '../components/Spinner/InlineSpinner'

const MainPage: FC = () => {
    return (
        <div className='outlet-wrapper flex-column'>
            <h1 className='h1' style={{ color: 'var(--text-color-my)' }}>
                KeyMan24 - Business
            </h1>
            <h1 className='h1' style={{ color: 'red' }}>
                Выберите организацию
            </h1>
        </div>
        // <div className='home-wrapper'>
        //     <h1 className='home-header'>Главное меню</h1>
        //     <div className='short-info-wrapper'>
        //         {/* <Card title='Ключи' current={4} total={50} Icon={SVGKey} />
        //         <Card title='Мат. ценности' current={1} total={18} Icon={SVGBriefcase} />
        //         <Card title='Сотрудники' current={4} total={10} Icon={SVGUsers} /> */}
        //     </div>
        // </div>
    )
}

export default MainPage
