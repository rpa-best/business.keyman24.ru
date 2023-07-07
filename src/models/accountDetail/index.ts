import { z } from 'zod'
import primitives from '../primitives'

// AccountDetail //
export const AccountDetailSchema = z.object({
    username: primitives.strMax150,
    name: primitives.strMax150OrNull,
    surname: primitives.strMax150OrNull,
    lastname: primitives.strMax150OrNull,
    email: primitives.emailMax254OrNull,
    phone: primitives.strOrNull,
    birthday: primitives.strOrNull, //! primitives.dateOrNull, but validation fails
    gender: primitives.strMax16OrNull,
    bio: primitives.strOrNull,
    avatar: primitives.strOrNull, //! primitives.str, but validation fails
    qrcode: primitives.uuid,
    is_activeuser: primitives.boolean,
    has_business: primitives.boolean,
})

export type IAccountDetail = z.infer<typeof AccountDetailSchema>
