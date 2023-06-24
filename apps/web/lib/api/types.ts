import { ReasonPhrase } from './server/http-status-codes'

export type ResponseError = {
  title: ReasonPhrase | string
  description: string
}

export type ApiResponse<T, TMeta = { [key: string]: string }> =
  | { message: string; data?: T; meta?: TMeta }
  | { errors: ResponseError[] }
