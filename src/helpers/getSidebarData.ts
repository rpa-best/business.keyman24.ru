import { type SidebarLinkProps } from '../components/Sidebar/SidebarLink'
import { ReactComponent as SVGHome } from '../assets/img/sidebar/home.svg'
import { ReactComponent as SVGBuilding } from '../assets/img/sidebar/building.svg'
import { ReactComponent as SVGFingerprint } from '../assets/img/sidebar/fingerprint.svg'
import { ReactComponent as SVGMarker } from '../assets/img/sidebar/marker.svg'
import { ReactComponent as SVGGlobe } from '../assets/img/sidebar/globe.svg'
import { ReactComponent as SVGBox } from '../assets/img/sidebar/box.svg'
import { ReactComponent as SVGUsers } from '../assets/img/sidebar/users.svg'
import { ReactComponent as SVGFluid } from '../assets/img/sidebar/layout-fluid.svg'
import { ReactComponent as SVGMail } from '../assets/img/sidebar/mail.svg'
import { ReactComponent as SVGWorker } from '../assets/img/sidebar/worker.svg'
import { ReactComponent as SVGBriefcase } from '../assets/img/sidebar/briefcase.svg'
import { ReactComponent as SVGUserLock } from '../assets/img/sidebar/user-lock.svg'
import { ReactComponent as SVGComputer } from '../assets/img/sidebar/computer.svg'
import { ReactComponent as SVGListCheck } from '../assets/img/sidebar/list-check.svg'

const sidebarData = (id: number): SidebarLinkProps[] => [
    // {
    //     title: 'Организация',
    //     link: '/org',
    //     Icon: SVGBuilding,
    //     children: [],
    // },
    {
        title: 'Устройство',
        link: `/${id}/device/`,
        Icon: SVGFingerprint,
        children: [
            // {
            //     title: 'Список устройств',
            //     link: '/device',
            // },
            // {
            //     title: 'Тип устройства',
            //     link: '/device-type',
            // },
        ],
        endpoint: 'device',
    },
    {
        title: 'Локация',
        link: `/${id}/location/`,
        Icon: SVGGlobe,
        children: [
            // {
            //     title: 'Список локаций',
            //     link: `/${id}/location/`,
            // },
            // {
            //     title: 'Объект локации',
            //     link: `/${id}/location-object/`,
            // },
        ],
        endpoint: 'location',
    },
    // {
    //     title: 'Регион',
    //     link: '/region',
    //     Icon: SVGGlobe,
    //     children: [
    //         {
    //             title: 'Список регионов',
    //             link: '/region',
    //         },
    //         {
    //             title: 'Тип региона',
    //             link: '/region-type',
    //         },
    //     ],
    // },
    {
        title: 'Инвентарь',
        link: `/${id}/inventory/`,
        Icon: SVGBriefcase,
        children: [],
        endpoint: 'inventory',
    },
    {
        title: 'Права доступа',
        link: `/${id}/permission-group/`,
        Icon: SVGUserLock,
        children: [
            // {
            //     title: 'Список прав доступа',
            //     link: '/permission',
            // },
            // {
            //     title: 'Группа Права доступа',
            //     link: `/${id}/permission-group/`,
            // },
            // {
            //     title: 'Уровень Права доступа',
            //     link: `/${id}/permission-level/`,
            // },
        ],
        endpoint: 'permission-group',
    },
    // {
    //     title: 'Подписки',
    //     link: '/subscription',
    //     Icon: SVGListCheck,
    //     children: [
    //         {
    //             title: 'Список подписок',
    //             link: '/subscription',
    //         },
    //         {
    //             title: 'Подписки Сервис',
    //             link: '/subscription-service',
    //         },
    //         {
    //             title: 'Запросы на подписку',
    //             link: '/subscription-request',
    //         },
    //     ],
    // },
    // {
    //     title: 'Системные сообщения',
    //     link: '/system-message',
    //     Icon: SVGMail,
    //     children: [],
    // },
    // {
    //     title: 'Пользователи',
    //     link: '/user',
    //     Icon: SVGUsers,
    //     children: [],
    // },
    {
        title: 'Работники',
        link: `/${id}/worker/`,
        Icon: SVGWorker,
        children: [],
        endpoint: 'worker',
    },
    {
        title: 'Рабочее место',
        link: `/${id}/working-area/`,
        Icon: SVGComputer,
        children: [],
        endpoint: 'working-area',
    },
]

const getSidebarData = (id: number): SidebarLinkProps[] => {
    // return []
    return sidebarData(id)
}

export default getSidebarData
