import { User } from 'database/client'

export enum Resource {
  USERS = 'users',
}

export type ResponseError = Array<{
  title: string
  detail: string
}>

export type FetchResourceResponse<T> =
  | {
      data: {
        type: Resource
        id: string
        attributes: T
        links?: { self?: string }
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
