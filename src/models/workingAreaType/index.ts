import { z } from 'zod'
import primitives from '../primitives'

// WorkingAreaType //
export const WorkingAreaTypeSchema = z.object({
    id: primitives.integer,
    slug: primitives.strMax50,
    name: primitives.strMax255,
})

export type IWorkingAreaType = z.infer<typeof WorkingAreaTypeSchema>

//! //
export const WorkingAreaTypeInputSchema = z.object({
    slug: primitives.strMax50,
    name: primitives.strMax255,
})

export type IWorkingAreaTypeInput = z.infer<typeof WorkingAreaTypeInputSchema>
