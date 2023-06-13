import { DatabaseTypes } from 'database/client'

export type ResponseError = Array<{
  title: string
  detail: string
}>

export type ApiResponse<T> = { data: T } | { errors: ResponseError }

export type FetchResourcesResponse<T> = { data: Array<T> } | { errors: ResponseError }

export type SanitizedUser = Omit<DatabaseTypes.User, 'id'>
