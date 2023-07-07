import { z } from 'zod'
import primitives from '../primitives'
import { WorkerSchema } from '../worker'

// WorkerInLocationShow //
export const WorkerNestedLocationSchema = z.object({
    id: primitives.integer,
    worker: WorkerSchema,
    org: primitives.integerOrNull,
})

export type IWorkerNestedLocation = z.infer<typeof WorkerNestedLocationSchema>

// WorkerInLocationCreateRequest //
export const WorkerNestedLocationInputSchema = z.object({
    worker: primitives.integer,
    location: primitives.integer,
})

export type IWorkerNestedLocationInput = z.infer<typeof WorkerNestedLocationInputSchema>