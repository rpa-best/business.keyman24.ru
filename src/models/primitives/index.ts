import { z } from 'zod'

const integer = z.number().int()

const integerOrNull = z.number().int().nullable()

const integerMaxMin = z
    .number()
    .int()
    .gte(-2147483648)
    .lte(2147483647)

const integerMaxMinOrNull = z
    .number()
    .int()
    .gte(-2147483648)
    .lte(2147483647)
    .nullable()

const double = z.number()

const str = z.string()

const strMax128 = z.string().max(128)

const strMax28OrNull = z.string().max(28).nullable()

const strMax256 = z.string().max(256)

const strMax255 = z.string().max(255)

const strMax255OrNull = z.string().max(255).nullable()

const strMin1Max255 = z.string().min(1).max(255)

const strMin1Max256 = z.string().min(1).max(256)

const strMax50 = z.string().max(50)

const strMin1Max50 = z.string().min(1).max(50)

const strMin1 = z.string().min(1)

const strMax150 = z.string().max(150)

const strMin1Max150 = z.string().min(1).max(150)

const strMax150OrNull = z.string().max(150).nullable()

const strMax16OrNull = z.string().max(16).nullable()

const strOrNull = z.string().nullable()

const emailMax254OrNull = z.string().email().max(254).nullable()

const dateOrNull = z.string().datetime().nullable()

const dateTime = z.string().datetime()

const dateTimeOrNull = z.string().datetime().nullable()

const uuid = z.string().uuid()

const uri = z.string().url()

const uriOrNull = z.string().url().nullable()

const boolean = z.boolean()

// eslint-disable-next-line no-shadow
export enum TypeEnum {
    read = 'read',
    create = 'create',
    update = 'update',
    delete = 'delete',
}

const type = z.nativeEnum(TypeEnum)

// eslint-disable-next-line no-shadow
export enum StatusEnum {
    invalid = 0,
    valid = 1,
}

const status = z.nativeEnum(StatusEnum)

// eslint-disable-next-line no-shadow
export enum PermissionEnum {
    get = 'GET',
    post = 'POST',
    patch = 'PATCH',
    delete = 'DELETE',
}

const permission = z.nativeEnum(PermissionEnum)

export default {
    integer,
    integerOrNull,
    integerMaxMin,
    integerMaxMinOrNull,
    double,
    str,
    strMax128,
    strMax28OrNull,
    strMax256,
    strMax255,
    strMax255OrNull,
    strMin1Max255,
    strMin1Max256,
    strMax50,
    strMin1Max50,
    strMin1,
    strMax150,
    strMin1Max150,
    strMax150OrNull,
    strMax16OrNull,
    strOrNull,
    emailMax254OrNull,
    dateOrNull,
    dateTime,
    dateTimeOrNull,
    uuid,
    uri,
    uriOrNull,
    boolean,
    type,
    status,
    permission,
}
