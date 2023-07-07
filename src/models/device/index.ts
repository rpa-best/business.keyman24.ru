import { z } from 'zod'
import primitives from '../primitives'

// DeviceList //
export const DeviceSchema = z.object({
    id: primitives.integer,
    name: primitives.strMax255,
    desc: primitives.strOrNull,
    sim_value: primitives.double,
    type: primitives.str,
})

export type IDevice = z.infer<typeof DeviceSchema>

//! //
export const DeviceInputSchema = z.object({
    name: primitives.strMin1Max255,
    desc: primitives.strOrNull,
    sim_value: primitives.double,
    type: primitives.str,
})

export type IDeviceInput = z.infer<typeof DeviceInputSchema>

//! //

export const DeviceTypeSchema = z.object({
    id: primitives.integer,
    slug: primitives.strMax50,
    name: primitives.strMax255,
})

export type IDeviceType = z.infer<typeof DeviceTypeSchema>

//! //

export const DeviceTypeInputSchema = z.object({
    slug: primitives.strMin1Max50,
    name: primitives.strMin1Max255,
})

export type IDeviceTypeInput = z.infer<
    typeof DeviceTypeInputSchema
>

//! //

export const DeviceNestedSchema = z.object({
    id: primitives.integer,
    device: DeviceSchema,
})

export type IDeviceNested = z.infer<typeof DeviceNestedSchema>

//! //

export const DeviceNestedInputSchema = z.object({
    device: primitives.integer,
})

export type IDeviceNestedInput = z.infer<typeof DeviceNestedInputSchema>
