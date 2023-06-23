/** Types and enums that can be used in both the client and the server */
export { Role, Status, Type, Country, ReservationStatus } from '@prisma/client'
import type * as DatabaseTypes from '@prisma/client'
export * from './countries'
export { DatabaseTypes }
