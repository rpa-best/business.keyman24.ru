import { z } from 'zod'
import primitives from '../primitives'

// LocationShow //
export const LocationSchema = z.object({
    id: primitives.integer,
    name: primitives.strMax255,
    desc: primitives.strOrNull,
    is_active: primitives.boolean,
    deleted: primitives.boolean,
})

export type ILocation = z.infer<typeof LocationSchema>

// LocationCreateRequest //
export const LocationInputSchema = z.object({
    name: primitives.strMin1Max255,
    desc: primitives.strOrNull,
    is_active: primitives.boolean,
    deleted: primitives.boolean,
})

export type ILocationInput = z.infer<typeof LocationInputSchema>

// ObjectInLocationShow //
export const LocationObjectSchema = z.object({
    id: primitives.integer,
    name: primitives.strMax255,
    desc: primitives.strOrNull,
    deleted: primitives.boolean,
})

export type ILocationObject = z.infer<typeof LocationObjectSchema>

// ObjectInLocationCreateRequest //
export const LocationObjectInputSchema = z.object({
    name: primitives.strMin1Max255,
    desc: primitives.strOrNull,
    deleted: primitives.boolean,
    // location: primitives.integer,
})

export type ILocationObjectInput = z.infer<typeof LocationObjectInputSchema>
