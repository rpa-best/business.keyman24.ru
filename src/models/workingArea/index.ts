import { z } from 'zod'
import { LocationSchema } from '../location'
import primitives from '../primitives'
import { WorkingAreaTypeSchema } from '../workingAreaType'

// WorkingAreaShow //
export const WorkingAreaSchema = z.object({
    id: primitives.integer,
    location: LocationSchema,
    type: WorkingAreaTypeSchema,
    name: primitives.strMax255,
    desc: primitives.strOrNull,
    deleted: primitives.boolean,
})

export type IWorkingArea = z.infer<typeof WorkingAreaSchema>

// WorkingAreaCreateRequest //
export const WorkingAreaInputSchema = z.object({
    name: primitives.strMin1Max255,
    desc: primitives.strOrNull,
    deleted: primitives.boolean,
    location: primitives.integer,
    type: primitives.str,
})

export type IWorkingAreaInput = z.infer<typeof WorkingAreaInputSchema>
