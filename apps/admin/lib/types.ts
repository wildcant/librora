import { User } from 'database/client'

export type ResponseError = Array<{
  title: string
  detail: string
}>

export type FetchResourceResponse<T> = { data: T } | { errors: ResponseError }

export type FetchResourcesResponse<T> = { data: Array<T> } | { errors: ResponseError }

export type SanitizedUser = Omit<User, 'id'>
