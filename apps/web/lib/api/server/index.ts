'server-only'

import { StatusCode, getReasonPhrase } from './http-status-codes'
import { ResponseError } from '../types'

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U

export type ErrorOptions = XOR<{ errors: ResponseError[] }, { errorMessage: string }>
type DataOptions<T, TMeta = { [key: string]: string }> = { data: T; meta?: TMeta }

export function apiResponse<T, TMeta = { [key: string]: string }>(
  status: StatusCode.CONTINUE,
  options?: DataOptions<T, TMeta>
): Response
export function apiResponse<T, TMeta = { [key: string]: string }>(
  status: StatusCode.SWITCHING_PROTOCOLS,
  options?: DataOptions<T, TMeta>
): Response
export function apiResponse<T, TMeta = { [key: string]: string }>(
  status: StatusCode.PROCESSING,
  options?: DataOptions<T, TMeta>
): Response
export function apiResponse<T, TMeta = { [key: string]: string }>(
  status: StatusCode.OK,
  options?: DataOptions<T, TMeta>
): Response
export function apiResponse<T, TMeta = { [key: string]: string }>(
  status: StatusCode.CREATED,
  options?: DataOptions<T, TMeta>
): Response
export function apiResponse<T, TMeta = { [key: string]: string }>(
  status: StatusCode.ACCEPTED,
  options?: DataOptions<T, TMeta>
): Response
export function apiResponse<T, TMeta = { [key: string]: string }>(
  status: StatusCode.NON_AUTHORITATIVE_INFORMATION,
  options?: DataOptions<T, TMeta>
): Response
export function apiResponse<T, TMeta = { [key: string]: string }>(
  status: StatusCode.NO_CONTENT,
  options?: DataOptions<T, TMeta>
): Response
export function apiResponse<T, TMeta = { [key: string]: string }>(
  status: StatusCode.RESET_CONTENT,
  options?: DataOptions<T, TMeta>
): Response
export function apiResponse<T, TMeta = { [key: string]: string }>(
  status: StatusCode.PARTIAL_CONTENT,
  options?: DataOptions<T, TMeta>
): Response
export function apiResponse<T, TMeta = { [key: string]: string }>(
  status: StatusCode.MULTI_STATUS,
  options?: DataOptions<T, TMeta>
): Response
export function apiResponse<T, TMeta = { [key: string]: string }>(
  status: StatusCode.MULTIPLE_CHOICES,
  options?: DataOptions<T, TMeta>
): Response
export function apiResponse<T, TMeta = { [key: string]: string }>(
  status: StatusCode.MOVED_PERMANENTLY,
  options?: DataOptions<T, TMeta>
): Response
export function apiResponse<T, TMeta = { [key: string]: string }>(
  status: StatusCode.MOVED_TEMPORARILY,
  options?: DataOptions<T, TMeta>
): Response
export function apiResponse<T, TMeta = { [key: string]: string }>(
  status: StatusCode.SEE_OTHER,
  options?: DataOptions<T, TMeta>
): Response
export function apiResponse<T, TMeta = { [key: string]: string }>(
  status: StatusCode.NOT_MODIFIED,
  options?: DataOptions<T, TMeta>
): Response
export function apiResponse<T, TMeta = { [key: string]: string }>(
  status: StatusCode.USE_PROXY,
  options?: DataOptions<T, TMeta>
): Response
export function apiResponse<T, TMeta = { [key: string]: string }>(
  status: StatusCode.TEMPORARY_REDIRECT,
  options?: DataOptions<T, TMeta>
): Response
export function apiResponse<T, TMeta = { [key: string]: string }>(
  status: StatusCode.PERMANENT_REDIRECT,
  options?: DataOptions<T, TMeta>
): Response
export function apiResponse(status: StatusCode.BAD_REQUEST, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.UNAUTHORIZED, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.PAYMENT_REQUIRED, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.FORBIDDEN, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.NOT_FOUND, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.METHOD_NOT_ALLOWED, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.NOT_ACCEPTABLE, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.PROXY_AUTHENTICATION_REQUIRED, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.REQUEST_TIMEOUT, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.CONFLICT, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.GONE, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.LENGTH_REQUIRED, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.PRECONDITION_FAILED, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.REQUEST_TOO_LONG, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.REQUEST_URI_TOO_LONG, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.UNSUPPORTED_MEDIA_TYPE, options: ErrorOptions): Response
export function apiResponse(
  status: StatusCode.REQUESTED_RANGE_NOT_SATISFIABLE,
  options: ErrorOptions
): Response
export function apiResponse(status: StatusCode.EXPECTATION_FAILED, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.IM_A_TEAPOT, options: ErrorOptions): Response
export function apiResponse(
  status: StatusCode.INSUFFICIENT_SPACE_ON_RESOURCE,
  options: ErrorOptions
): Response
export function apiResponse(status: StatusCode.METHOD_FAILURE, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.MISDIRECTED_REQUEST, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.UNPROCESSABLE_ENTITY, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.LOCKED, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.FAILED_DEPENDENCY, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.PRECONDITION_REQUIRED, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.TOO_MANY_REQUESTS, options: ErrorOptions): Response
export function apiResponse(
  status: StatusCode.REQUEST_HEADER_FIELDS_TOO_LARGE,
  options: ErrorOptions
): Response
export function apiResponse(status: StatusCode.UNAVAILABLE_FOR_LEGAL_REASONS, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.INTERNAL_SERVER_ERROR, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.NOT_IMPLEMENTED, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.BAD_GATEWAY, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.SERVICE_UNAVAILABLE, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.GATEWAY_TIMEOUT, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.HTTP_VERSION_NOT_SUPPORTED, options: ErrorOptions): Response
export function apiResponse(status: StatusCode.INSUFFICIENT_STORAGE, options: ErrorOptions): Response
export function apiResponse(
  status: StatusCode.NETWORK_AUTHENTICATION_REQUIRED,
  options: ErrorOptions
): Response
export function apiResponse<T, TMeta = { [key: string]: string }>(
  status: StatusCode,
  options: ErrorOptions | (DataOptions<T, TMeta> | undefined)
): Response {
  if (!options) {
    return new Response(JSON.stringify({ message: getReasonPhrase(status) }), { status })
  }

  if ('errors' in options) {
    return new Response(JSON.stringify({ errors: options.errors }), { status })
  }

  if ('errorMessage' in options) {
    const error: ResponseError = { title: getReasonPhrase(status), description: options.errorMessage }
    return new Response(JSON.stringify({ errors: [error] }), { status })
  }

  return new Response(JSON.stringify({ ...options, message: getReasonPhrase(status) }), { status })
}
