import axios from "@/plugins/axios";

const org = localStorage.getItem('org')

const menu = [
    {
        label: 'sidebar.dashboard',
        items: [
            {
                label: 'sidebar.home_dashboard',
                icon: 'pi pi-fw pi-home',
                to: '/',
                check_url: `/api/v1.1/business/${org}/statistics/home/line-chart/`
            },
            {
                label: 'sidebar.location_dashboard',
                icon: 'pi pi-fw pi-map-marker',
                to: '/',
                check_url: `/api/v1.1/business/${org}/location/`
            },
            {
                label: 'sidebar.working_area_dashboard',
                icon: 'pi pi-fw pi-building',
                to: '/',
                check_url: `/api/v1.1/business/${org}/working_area/`
            },
            {
                label: 'sidebar.inventory_dashboard',
                icon: 'pi pi-fw pi-th-large',
                to: '/',
                check_url: `/api/v1.1/business/${org}/inventory/`
            },
            {
                label: 'sidebar.device_dashboard',
                icon: 'pi pi-fw pi-bolt',
                to: '/',
                check_url: `/api/v1.1/business/${org}/device/`
            },
            {
                label: 'sidebar.workers_dashboard',
                icon: 'pi pi-fw pi-user',
                to: '/',
                check_url: `/api/v1.1/business/${org}/worker/`
            },
        ],
    },
    {
        label: 'sidebar.main',
        items: [
            {
                label: 'sidebar.location',
                icon: 'pi pi-fw pi-map-marker',
                to: '/',
                check_url: `/api/v1.1/business/${org}/location/`
            },
            {
                label: 'sidebar.working_area',
                icon: 'pi pi-fw pi-building',
                to: '/',
                check_url: `/api/v1.1/business/${org}/working_area/`
            },
            {
                label: 'sidebar.inventory',
                icon: 'pi pi-fw pi-th-large',
                to: {name: 'inventory-list'},
                check_url: `/api/v1.1/business/${org}/inventory/`
            },
            {
                label: 'sidebar.device',
                icon: 'pi pi-fw pi-bolt',
                to: {name: 'device-list'},
                check_url: `/api/v1.1/business/${org}/device/`
            },
        ]
    },
    {
        label: 'sidebar.admin',
        items: [
            {
                label: 'sidebar.workers',
                icon: 'pi pi-fw pi-user',
                to: {name: 'worker-list'},
                check_url: `/api/v1.1/business/${org}/worker/`
            },
            {
                label: 'sidebar.groups',
                icon: 'pi pi-fw pi-users',
                to: {name: 'group-list'},
                check_url: `/api/v1.1/business/${org}/permission/group/`
            }
        ],
    },

]

const get_final_sidebar = async (items) => {
    for (let item of items) {
        if (item.items) {
            await get_final_sidebar(item.items)
            if (!item.items) {
                item.not_show = true
            }

        }
        if (item.check_url) {
            try {
                const r = await axios.head(item.check_url)
                item.permissions = r.headers.get('Has-Permissions')
            } catch (e) {
                item.not_show = true;
            }
        }
    }
    return items
}

export default {
    state: {
        sidebar: []
    },
    actions: {
        async fetch_sidebar(context) {


            const data = [

                {
                    label: 'Prime Blocks',
                    items: [
                        {label: 'Free Blocks', icon: 'pi pi-fw pi-eye', to: '/blocks', badge: 'NEW'},
                        {
                            label: 'All Blocks',
                            icon: 'pi pi-fw pi-globe',
                            url: 'https://www.primefaces.org/primeblocks-vue',
                            target: '_blank'
                        }
                    ]
                },
                {
                    label: 'Utilities',
                    items: [
                        {label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', to: '/utilities/icons'},
                        {
                            label: 'PrimeFlex',
                            icon: 'pi pi-fw pi-desktop',
                            url: 'https://www.primefaces.org/primeflex/',
                            target: '_blank'
                        }
                    ]
                },
                {
                    label: 'Pages',
                    icon: 'pi pi-fw pi-briefcase',
                    to: '/pages',
                    items: [
                        {
                            label: 'Landing',
                            icon: 'pi pi-fw pi-globe',
                            to: '/landing'
                        },
                        {
                            label: 'Auth',
                            icon: 'pi pi-fw pi-user',
                            items: [
                                {
                                    label: 'Login',
                                    icon: 'pi pi-fw pi-sign-in',
                                    to: '/auth/login'
                                },
                                {
                                    label: 'Error',
                                    icon: 'pi pi-fw pi-times-circle',
                                    to: '/auth/error'
                                },
                                {
                                    label: 'Access Denied',
                                    icon: 'pi pi-fw pi-lock',
                                    to: '/auth/access'
                                }
                            ]
                        },
                        {
                            label: 'Crud',
                            icon: 'pi pi-fw pi-pencil',
                            to: '/pages/crud'
                        },
                        {
                            label: 'Timeline',
                            icon: 'pi pi-fw pi-calendar',
                            to: '/pages/timeline'
                        },
                        {
                            label: 'Not Found',
                            icon: 'pi pi-fw pi-exclamation-circle',
                            to: '/pages/notfound'
                        },
                        {
                            label: 'Empty',
                            icon: 'pi pi-fw pi-circle-off',
                            to: '/pages/empty'
                        }
                    ]
                },
                {
                    label: 'Hierarchy',
                    items: [
                        {
                            label: 'Submenu 1',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [
                                {
                                    label: 'Submenu 1.1',
                                    icon: 'pi pi-fw pi-bookmark',
                                    items: [
                                        {label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark'},
                                        {label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark'},
                                        {label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark'}
                                    ]
                                },
                                {
                                    label: 'Submenu 1.2',
                                    icon: 'pi pi-fw pi-bookmark',
                                    items: [{label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark'}]
                                }
                            ]
                        },
                        {
                            label: 'Submenu 2',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [
                                {
                                    label: 'Submenu 2.1',
                                    icon: 'pi pi-fw pi-bookmark',
                                    items: [
                                        {label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark'},
                                        {label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark'}
                                    ]
                                },
                                {
                                    label: 'Submenu 2.2',
                                    icon: 'pi pi-fw pi-bookmark',
                                    items: [{label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark'}]
                                }
                            ]
                        }
                    ]
                },
                {
                    label: 'Get Started',
                    items: [
                        {
                            label: 'Documentation',
                            icon: 'pi pi-fw pi-question',
                            to: '/documentation'
                        },
                        {
                            label: 'View Source',
                            icon: 'pi pi-fw pi-search',
                            url: 'https://github.com/primefaces/sakai-vue',
                            target: '_blank'
                        }
                    ]
                }
            ]
            const final_menu = await get_final_sidebar(menu)
            context.commit('set_sidebar', final_menu)
        }
    },
    getters: {
        get_sidebar: (state) => state.sidebar
    },
    mutations: {
        set_sidebar(state, data) {
            state.sidebar = data
        }
    }
}