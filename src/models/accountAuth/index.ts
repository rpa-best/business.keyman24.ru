import { z } from 'zod'
import primitives from '../primitives'

// auth_requestRequest //
export const AuthRequestSchema = z.object({
    username: primitives.strMin1,
    password: primitives.strMin1,
})

export type IAuthRequest = z.infer<typeof AuthRequestSchema>

// auth_response2 //
export const AuthResponseSchema = z.object({
    access: primitives.str,
    refresh: primitives.str,
})

export type IAuthResponse = z.infer<typeof AuthResponseSchema>
