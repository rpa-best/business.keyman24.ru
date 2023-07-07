import { z } from 'zod'
import primitives from '../primitives'

// WorkerDocs //
export const WorkerDocsSchema = z.object({
    id: primitives.integer,
    lc_id: primitives.integerMaxMin,
    name: primitives.strMax255,
    user_lc_id: primitives.integerMaxMinOrNull,
    active_from: primitives.dateOrNull,
    active_to: primitives.dateOrNull,
    zp: primitives.strMax150OrNull, //! must be 30 or null
    org_lc_id: primitives.integerMaxMinOrNull,
    worker: primitives.integerOrNull,
})

export type IWorkerDocs = z.infer<typeof WorkerDocsSchema>

//!
export const WorkerDocsInputSchema = z.object({
    some: primitives.integer,
})

export type IWorkerDocsInput = z.infer<typeof WorkerDocsInputSchema>
