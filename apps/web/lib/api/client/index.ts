import { ApiResponse, ResponseError } from '../types'

async function post<TBody, TData = Record<string, string | number>, TMeta = Record<string, string | number>>(
  endpoint: RequestInfo | URL,
  init?: Omit<RequestInit, 'method' | 'body'> & { body: TBody }
): Promise<ApiResponse<TData, TMeta>> {
  const response = await fetch(endpoint, { ...init, method: 'post', body: JSON.stringify(init?.body) })
  const apiResponse: ApiResponse<TData, TMeta> = await response.json()

  if ('errors' in apiResponse) {
    throw apiResponse.errors
  }

  if (!response.ok) {
    const genericError: ResponseError = {
      title: 'There was a problem',
      description: 'Please contact an administrator.',
    }
    throw [genericError]
  }

  return apiResponse
}

export const api = {
  post,
}
