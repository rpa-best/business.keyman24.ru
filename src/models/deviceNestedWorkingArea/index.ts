import { z } from 'zod'
import primitives from '../primitives'
import { DeviceSchema } from '../device'

// DeviceToWorkingAreaShow //
export const DeviceNestedWorkingAreaSchema = z.object({
    id: primitives.integer,
    area: primitives.integer,
    device: DeviceSchema,
})

export type IDeviceNestedWorkingArea = z.infer<
    typeof DeviceNestedWorkingAreaSchema
>

//! //
export const DeviceNestedWorkingAreaInputSchema = z.object({
    area: primitives.integer,
    device: primitives.integer,
})

export type IDeviceNestedWorkingAreaInput = z.infer<
    typeof DeviceNestedWorkingAreaInputSchema
>
