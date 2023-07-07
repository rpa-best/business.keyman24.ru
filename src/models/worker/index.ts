import { z } from 'zod'
import primitives from '../primitives'
import { UserInputSchema, UserSchema } from '../user'
import { OrganizationSchema } from '../organization'

// WorkerListSerialzier //
export const WorkerSchema = z.object({
    id: primitives.integer,
    image: primitives.strOrNull,
    user: UserSchema,
    lc_id: primitives.integerMaxMinOrNull,
    name: primitives.strMax255OrNull,
    user_lc_id: primitives.integerMaxMinOrNull,
    org: OrganizationSchema,
})

export type IWorker = z.infer<typeof WorkerSchema>

// PatchedWorkerListSerialzierRequest //
export const WorkerInputSchema = z.object({
    user: UserInputSchema,
    lc_id: primitives.integerMaxMinOrNull,
    name: primitives.strMax255OrNull,
    user_lc_id: primitives.integerMaxMinOrNull,
    org: primitives.integerOrNull,
})

export type IWorkerInput = z.infer<typeof WorkerInputSchema>
