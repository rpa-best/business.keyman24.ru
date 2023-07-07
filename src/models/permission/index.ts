import { z } from 'zod'
import primitives from '../primitives'

// PermissionLevel //
export const PermissionLevelSchema = z.object({
    id: primitives.integer,
    name: primitives.strMax255,
})

export type IPermissionLevel = z.infer<typeof PermissionLevelSchema>

//! //
export const PermissionLevelInputSchema = z.object({
    id: primitives.integer,
    name: primitives.strMax255,
})

export type IPermissionLevelInput = z.infer<typeof PermissionLevelInputSchema>

// Permission //
export const PermissionSchema = z.object({
    id: primitives.integer,
    slug: primitives.strMax50,
    name: primitives.strMax256,
    level: PermissionLevelSchema,
})

export type IPermission = z.infer<typeof PermissionSchema>

//! //
export const PermissionInputSchema = z.object({
    slug: primitives.strMin1Max50,
    name: primitives.strMin1Max256,
    level: primitives.integer,
})

export type IPermissionInput = z.infer<typeof PermissionInputSchema>

// PermissionGroupList //
export const PermissionGroupSchema = z.object({
    id: primitives.integer,
    level: PermissionLevelSchema,
    name: primitives.strMax255,
})

export type IPermissionGroup = z.infer<typeof PermissionGroupSchema>

// PermissionGroupRequest //
export const PermissionGroupInputSchema = z.object({
    name: primitives.strMax255,
    level: primitives.integer,
})

export type IPermissionGroupInput = z.infer<typeof PermissionGroupInputSchema>

// PermissionToPermissionGroup //
export const PermissionNestedSchema = z.object({
    id: primitives.integer,
    permission: PermissionSchema,
    type: primitives.type,
})

export type IPermissionNested = z.infer<typeof PermissionNestedSchema>

// PermissionToPermissionCreateGroupRequest //
export const PermissionNestedInputSchema = z.object({
    type: primitives.type,
    permission: primitives.integer,
})

export type IPermissionNestedInput = z.infer<typeof PermissionNestedInputSchema>

// PermissionGroup //
export const PermissionGroupForUserSchema = z.object({
    id: primitives.integer,
    name: primitives.strMax255,
    level: PermissionLevelSchema,
})

export type IPermissionGroupForUser = z.infer<typeof PermissionGroupForUserSchema>

// PermissionGroupToUserList
export const PermissionGroupToUserListSchema = z.object({
    id: primitives.integer,
    group: PermissionGroupForUserSchema,
})

export type IPermissionGroupUser = z.infer<typeof PermissionGroupToUserListSchema>

// PermissionGroupToUserCreateRequest
export const PermissionGroupUserInputSchema = z.object({
    group: primitives.integer,
    user: primitives.str,
})

export type IPermissionGroupUserInput = z.infer<typeof PermissionGroupUserInputSchema>

// PermissionToUserList
export const PermissionToUserListSchema = z.object({
    id: primitives.integer,
    type: primitives.type,
    permission: PermissionSchema,
})

export type IPermissionUser = z.infer<typeof PermissionToUserListSchema>

// PermissionToUserCreateRequest
export const PermissionUserInputSchema = z.object({
    type: primitives.type,
    user: primitives.str,
    permission: primitives.integer,
})

export type IPermissionUserInput = z.infer<typeof PermissionUserInputSchema>

// PermissionToAdminList
export const PermissionToAdminListSchema = z.object({
    id: primitives.integer,
    type: primitives.type,
    permission: PermissionSchema,
    org: primitives.integer,
})

export type IPermissionAdmin = z.infer<typeof PermissionToAdminListSchema>

// PermissionToAdminCreateRequest
export const PermissionAdminInputSchema = z.object({
    type: primitives.type,
    org: primitives.integer,
    permission: primitives.integer,
})

export type IPermissionAdminInput = z.infer<typeof PermissionAdminInputSchema>

// PermissionGroupToAdminList //
export const PermissionGroupToAdminSchema = z.object({
    id: primitives.integer,
    group: PermissionGroupForUserSchema,
    org: primitives.integer,
})

export type IPermissionGroupToAdmin = z.infer<typeof PermissionGroupToAdminSchema>

// PermissionGroupToAdminListRequest
export const PermissionGroupToAdminInputSchema = z.object({
    group: primitives.integer,
    org: primitives.integer,
})

export type IPermissionGroupToAdminInput = z.infer<typeof PermissionGroupToAdminInputSchema>
