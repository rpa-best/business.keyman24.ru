import { z } from 'zod'
import primitives from '../primitives'
import { RegionSchema } from '../region'

// OrganizationShow
export const OrganizationSchema = z.object({
    id: primitives.integer,
    region: RegionSchema.nullable(), //! perhaps, can't be null
    name: primitives.strMax255,
    create_at: primitives.str, //! primitives.dateTime, but validation fails
    lc_id: primitives.integerMaxMinOrNull,
    inn: primitives.strMax255OrNull,
    address: primitives.strMax255OrNull,
    phone: primitives.strMax255OrNull,
    email: primitives.strMax255OrNull,
})

export type IOrganization = z.infer<typeof OrganizationSchema>

// // organization
// export interface IOrganization {
//     readonly id: number
//     name: string
//     readonly create_at: string
//     lc_id: number | null| undefined
//     inn: string | null
//     address: string | null
//     phone: string | null
//     email: string | null
//     region: number | null| undefined
// }

// export interface IOrganizationInput {
//     name: string
//     inn: string | null
//     address: string | null
//     phone: string | null
//     email: string | null
//     region: number | null| undefined
// }

// export interface IOrganizationNested {
//     readonly id: number
//     from_date: string | null
//     to_date: string | null
//     file: string | null
//     to_org: number
// }

// export interface IOrganizationNestedInput {
//     from_date: string | null
//     to_date: string | null
//     file: string | null
//     to_org: number
// }
