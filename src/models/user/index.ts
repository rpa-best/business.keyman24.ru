import { z } from 'zod'
import primitives from '../primitives'

// UserList //
export const UserSchema = z.object({
    id: primitives.integer,
    fullname: primitives.str,
    avatar: primitives.str,
    username: primitives.strMax150,
    date_joined: primitives.dateTime,
    is_official: primitives.boolean,
})

export type IUser = z.infer<typeof UserSchema>

// UserListRequest //
export const UserInputSchema = z.object({
    fullname: primitives.strMin1,
    username: primitives.strMin1Max150,
    date_joined: primitives.dateTime,
    is_official: primitives.boolean,
})

export type IUserInput = z.infer<typeof UserInputSchema>

// BusinessUserShow //
export const BusinessUserSchema = z.object({
    username: primitives.strMax150,
    phone: primitives.strMax28OrNull,
    name: primitives.strMax150OrNull,
    lastname: primitives.strMax150OrNull,
    surname: primitives.strMax150OrNull,
    is_official: primitives.boolean,
})

export type IBusinessUser = z.infer<typeof BusinessUserSchema>

// BusinessUserCreateRequest //
export const BusinessUserCreateRequestSchema = z.object({
    username: primitives.strMin1,
    password1: primitives.strMin1,
    password2: primitives.strMin1,
    phone: primitives.str,
})

export type IBusinessUserCreateRequest = z.infer<typeof BusinessUserCreateRequestSchema>

// BusinessUserCreate //
export const BusinessUserCreateSchema = z.object({
    username: primitives.str,
    phone: primitives.str,
})

export type IBusinessUserCreate = z.infer<typeof BusinessUserCreateSchema>
