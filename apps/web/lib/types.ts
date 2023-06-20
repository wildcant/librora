import { DatabaseTypes } from 'database/client'

export type ExcludeId<T> = Omit<T, 'id'>

export type ResponseError = Array<{
  title: string
  detail: string
  context?: any
}>

export type ApiResponse<T, TMeta = { [key: string]: string }> =
  | { data: T; meta?: TMeta }
  | { errors: ResponseError }

export type SanitizedUser = Omit<DatabaseTypes.User, 'password'> & {
  location: DatabaseTypes.Location | null
}

export type Book = DatabaseTypes.Book & {
  image: DatabaseTypes.Image
}
