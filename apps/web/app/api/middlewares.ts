import { apiResponse } from '@/lib/api/server'
import { StatusCode } from '@/lib/api/server/http-status-codes'
import { getCurrentUser } from '@/lib/get-current-user'
import { SanitizedUser } from '@/lib/types'
import { z } from 'zod'

export type UserValidationHandler = (req: Request, options: { user: SanitizedUser }) => Promise<Response>
/** Validate user is authenticated. */
export const validateUser =
  (handler: UserValidationHandler) =>
  async (req: Request): Promise<Response> => {
    const user = await getCurrentUser()
    if (!user) return apiResponse(StatusCode.UNAUTHORIZED, { errorMessage: 'Please login.' })
    return handler(req, { user })
  }

export type BodyParserHandler<TData> = (
  req: Request,
  options: { user: SanitizedUser; data: TData }
) => Promise<Response>
/** Validate/Parse request body. */
export const parseBody =
  <T>(handler: BodyParserHandler<T>, schema: z.ZodObject<any>): UserValidationHandler =>
  async (req, options) => {
    try {
      const data = schema.parse(await req.json()) as T
      return handler(req, { ...options, data })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return apiResponse(StatusCode.BAD_REQUEST, {
          errors: error.issues.map((issue) => ({
            title: 'Invalid input',
            description: `${issue.path.join(',')} ${issue.message.toLowerCase()}`,
          })),
        })
      }

      return apiResponse(StatusCode.BAD_REQUEST, {
        errorMessage: 'Invalid user input.',
      })
    }
  }
