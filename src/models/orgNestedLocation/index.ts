import { z } from 'zod'
import primitives from '../primitives'
import { LocationSchema } from '../location'

const ToOrgNestedLocationSchema = z.object({
    id: primitives.integer,
    name: primitives.str,
    desc: primitives.strOrNull,
})

// OrgInLocationShow //
export const OrgNestedLocationSchema = z.object({
    id: primitives.integer,
    org: primitives.integer,
    to_org: ToOrgNestedLocationSchema,
})

export type IOrgNestedLocation = z.infer<typeof OrgNestedLocationSchema>

// OrgInLocationCreateRequest //
export const OrgNestedLocationInputSchema = z.object({
    location: primitives.integer,
})

export type IOrgNestedLocationInput = z.infer<typeof OrgNestedLocationInputSchema>
