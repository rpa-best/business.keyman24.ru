import {
    sessionElementExport,
    sessionInventoryElementExport,
    sessionKeyElementExport,
    sessionRegisterElementExport,
    sessionRegisterInventoryElementExport,
    sessionSecurityElementExport,
} from '../config/tableHeaders'

const getHeadersByType = (sessionType: string) => {
    switch (sessionType) {
    case 'register':
        return sessionRegisterElementExport.default
    case 'security':
        return sessionSecurityElementExport.default
    case 'register_inventory':
        return sessionRegisterInventoryElementExport.default
    case 'inventory':
        return sessionInventoryElementExport.default
    case 'key':
        return sessionKeyElementExport.default
    default:
        return sessionElementExport.default
    }
}

export default getHeadersByType
