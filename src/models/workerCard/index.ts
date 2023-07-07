import { z } from 'zod'
import primitives from '../primitives'

// WorkerCard //
export const WorkerCardSchema = z.object({
    id: primitives.integer,
    card: primitives.strMax150, //! must be 100
})

export type IWorkerCard = z.infer<typeof WorkerCardSchema>

//!
export const WorkerCardInputSchema = z.object({
    some: primitives.integer,
})

export type IWorkerCardInput = z.infer<typeof WorkerCardInputSchema>
