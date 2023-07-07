import { z } from 'zod';
import primitives from '../primitives';

// RegionType
export const RegionTypeSchema = z.object({
    id: primitives.integer,
    name: primitives.strMax128,
})

export type IRegionType = z.infer<typeof RegionTypeSchema>

// Region
export const RegionSchema = z.object({
    id: primitives.integer,
    type: RegionTypeSchema,
    name: primitives.strMax256,
    status: primitives.boolean,
    parent: primitives.integerOrNull,
})

export type IRegion = z.infer<typeof RegionSchema>

// export interface IRegionCreate {
//     readonly id: number
//     name: string
//     status: boolean
//     parent: number | null
//     type: number | null
// }

// export interface IRegionInput {
//     name: string
//     status: boolean
//     parent: number | undefined
//     type: number
// }

// export interface IRegionTypeInput {
//     name: string
// }
