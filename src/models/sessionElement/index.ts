import { z } from 'zod'
import primitives from '../primitives'
import { WorkerSchema } from '../worker'

// WorkingAreaSessionElement //
export const SessionElementSchema = z.object({
    id: primitives.integer,
    worker: WorkerSchema,
    mode: primitives.boolean,
    date: primitives.dateTime,
    comment: primitives.strOrNull,
    image: primitives.uriOrNull,
    inventory: primitives.integerOrNull,
    card: primitives.strMax255OrNull,
})

export type ISessionElement = z.infer<typeof SessionElementSchema>

//! //
export const SessionElementInputSchema = z.object({
    some: primitives.integer,
})

export type ISessionElementInput = z.infer<typeof SessionElementInputSchema>
