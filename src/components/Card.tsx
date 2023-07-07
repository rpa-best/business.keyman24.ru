import '../assets/styles/scss/card.scss'
import React, { FC, SVGProps } from 'react'

interface CardProps {
    title: string
    current: number
    total: number
    Icon: FC<SVGProps<SVGSVGElement>>
}

const Card: FC<CardProps> = props => {
    const {
        title, current, total, Icon,
    } = props
    return (
        <div className='card-wrapper'>
            <div className='description-wrapper'>
                <p className='card-title'>{title}</p>
                <p className='card-number'>{`${current} / ${total}`}</p>
            </div>
            <div className='card-ico'>
                <Icon />
            </div>
        </div>
    )
}

export default Card
