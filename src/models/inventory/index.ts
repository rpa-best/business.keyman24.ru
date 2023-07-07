import { z } from 'zod'
import primitives from '../primitives'

// InventoryType //
export const InventoryTypeSchema = z.object({
    id: primitives.integer,
    slug: primitives.strMax50,
    name: primitives.strMax255,
    desc: primitives.strOrNull,
})

export type IInventoryType = z.infer<typeof InventoryTypeSchema>

//! //
export const InventoryTypeInputSchema = z.object({
    slug: primitives.strMax50,
    name: primitives.strMax255,
    desc: primitives.strOrNull,
})

export type IInventoryTypeInput = z.infer<typeof InventoryTypeInputSchema>

// InventoryShow //
export const InventorySchema = z.object({
    id: primitives.integer,
    type: InventoryTypeSchema,
    comments: primitives.str,
    not_zone: primitives.boolean,
    number: primitives.strMax255OrNull,
    name: primitives.strMax255,
    desc: primitives.strOrNull,
    code_image: primitives.str,
    is_active: primitives.boolean,
    location: primitives.integerOrNull,
    object_area: primitives.integerOrNull,
})

export type IInventory = z.infer<typeof InventorySchema>

// InventoryCreateRequest
export const InventoryInputSchema = z.object({
    number: primitives.strMax255OrNull,
    type: primitives.str,
    name: primitives.strMin1Max255,
    desc: primitives.strOrNull,
})

export type IInventoryInput = z.infer<typeof InventoryInputSchema>

// InventoryImageShow //
export const InventoryImageSchema = z.object({
    id: primitives.integer,
    image: primitives.str,
    main: primitives.boolean,
    date: primitives.dateTime,
})

export type IInventoryImage = z.infer<typeof InventoryImageSchema>

//! InventoryImageCreateRequest //
export const InventoryImageInputSchema = z.object({
    image: z.any(),
})

export type IInventoryImageInput = z.infer<typeof InventoryImageInputSchema>
