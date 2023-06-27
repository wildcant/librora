import { apiResponse } from '@/lib/api/server'
import { StatusCode } from '@/lib/api/server/http-status-codes'
import { getCurrentUser } from '@/lib/get-current-user'
import { SanitizedUser } from '@/lib/types'
import merge from 'lodash/merge'
import { NextRequest } from 'next/server'
import { z } from 'zod'

export type Callback<TNextRequest = NextRequest, TNextRequestNext = NextRequest> = (
  req: TNextRequest,
  options: any,
  next?: Middleware<TNextRequestNext>
) => void

// We should differentiate between current handle req and next handle req, since the middleware might change said object.
interface Middleware<TNextRequest = NextRequest, TNextRequestNext = NextRequest> {
  originalNextRequest: TNextRequest
  handle: Callback<TNextRequest, TNextRequestNext>
  next: Middleware<TNextRequestNext> | undefined
  setNext: (middleware: Middleware<TNextRequestNext>) => Middleware<TNextRequestNext>
}

const middleware = <TNextRequest = NextRequest, TNextRequestNext = NextRequest>(
  originalNextRequest: TNextRequest,
  callback: Callback<TNextRequest, TNextRequestNext>
): Middleware<TNextRequest, TNextRequestNext> => ({
  originalNextRequest,
  handle(req, options) {
    let newRequest = req
    // Restore key properties after a middleware runs.
    if (this.originalNextRequest instanceof Request && req instanceof Request) {
      newRequest = Object.assign(req, { json: this.originalNextRequest.json })
    }
    return callback(newRequest, options, this.next)
  },
  next: undefined,
  setNext(nextMiddleware) {
    this.next = nextMiddleware
    return nextMiddleware
  },
})

/** Route implementation. */
export const route = (req: NextRequest, options?: any) => ({
  handler: undefined as any | undefined,
  chain: undefined as any | undefined,
  req,
  options,
  use<TNextRequest = NextRequest, TNextRequestNext = NextRequest>(
    callback: Callback<TNextRequest, TNextRequestNext>
  ) {
    if (!this.handler || !this.chain) {
      this.handler = middleware<TNextRequest, TNextRequestNext>(
        req as TNextRequest,
        callback
      ) as unknown as Middleware<TNextRequest, TNextRequestNext>
      this.chain = this.handler
    } else {
      this.chain = this.chain?.setNext(middleware(req as TNextRequest, callback))
    }
    return this
  },
  exec() {
    return this.handler?.handle(this.req!, this.options)
  },
})

export type UserValidationExtension = { user: SanitizedUser }
/** Validate user is authenticated. */
export const validateUser: Callback<NextRequest, NextRequest & UserValidationExtension> = async (
  req,
  options,
  next
) => {
  const user = await getCurrentUser()
  if (!user) return apiResponse(StatusCode.UNAUTHORIZED, { errorMessage: 'Please login.' })

  return next?.handle(merge(req, { user }), options)
}

export type BodyParserExtension<T> = { data: T }
/** Validate/Parse NextRequest body. */
export const parseBody =
  <TBodyShape extends z.ZodRawShape>(
    schema: z.ZodObject<TBodyShape>
  ): Callback<NextRequest, NextRequest & BodyParserExtension<TBodyShape>> =>
  async (req, options, next) => {
    try {
      const data = schema.parse(await req.json()) as unknown as TBodyShape
      return next?.handle(merge(req, { data }), options)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return apiResponse(StatusCode.BAD_REQUEST, {
          errors: error.issues.map((issue) => ({
            title: 'Invalid input',
            description: `${issue.path.join(',')} ${issue.message.toLowerCase()}`,
          })),
        })
      }
      console.error(error)
      return apiResponse(StatusCode.BAD_REQUEST, {
        errorMessage: 'Invalid user input.',
      })
    }
  }

export type ExtendedRequest<T> = NextRequest & T
