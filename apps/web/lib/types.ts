import { User } from 'database/client'

export enum Resource {
  USERS = 'users',
  BOOKS = 'books',
}

export type ExcludeId<T> = Omit<T, 'id'>

export type ResponseError = Array<{
  title: string
  detail: string
}>

export type FetchResourceResponse<T, TMeta = { [key: string]: string }> =
  | {
      data: {
        type: Resource
        id: string
        attributes: T
        links?: { self?: string }
        meta?: TMeta
      }
      // included // TODO
    }
  | {
      errors: ResponseError
    }

export type FetchResourcesResponse<T> =
  | {
      data: Array<{
        type: Resource
        id: string
        attributes: T
        links?: { self?: string }
      }>
      // included // TODO
    }
  | {
      errors: ResponseError
    }

export type SanitizedUser = Omit<User, 'id' | 'password'>
