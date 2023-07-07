import { z } from 'zod'
import primitives from '../primitives'

// UploadedFile //
export const InventoryUploadSchema = z.object({
    id: primitives.integer,
    name: primitives.str,
    count: primitives.integer,
    file: primitives.uri,
    date: primitives.dateTime,
    pdf: primitives.uriOrNull,
    type: primitives.str,
})

export type IInventoryUpload = z.infer<typeof InventoryUploadSchema>

//! UploadedFileRequest //
export const InventoryUploadInputSchema = z.object({
    file: z.any(),
    type: primitives.str,
})

export type IInventoryUploadInput = z.infer<typeof InventoryUploadInputSchema>
