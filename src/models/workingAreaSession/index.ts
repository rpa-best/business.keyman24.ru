import { z } from 'zod'
import primitives from '../primitives'
import { UserSchema } from '../user'

// WorkingAreaSessionShow //
export const WorkingAreaSessionSchema = z.object({
    id: primitives.integer,
    user: UserSchema,
    number: primitives.integerMaxMin,
    start_date: primitives.dateTime,
    end_date: primitives.dateTimeOrNull,
    status: primitives.status,
})

export type IWorkingAreaSession = z.infer<typeof WorkingAreaSessionSchema>

//! WorkingAreaSessionCreateRequest //
export const WorkingAreaSessionInputSchema = z.object({
    number: primitives.integerMaxMin,
    end_date: primitives.dateTimeOrNull,
    status: primitives.status,
    user: primitives.str,
})
// export const WorkingAreaSessionInputSchema = z.object({})

export type IWorkingAreaSessionInput = z.infer<typeof WorkingAreaSessionInputSchema>