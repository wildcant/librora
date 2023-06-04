import { NextResponse } from 'next/server'

export function middleware(request: Request) {
  // Store current request url in a custom header, which you can read later
  // Work around to get the the url path in a server component 🙄
  // @see https://github.com/vercel/next.js/issues/43704#issuecomment-1411186664
  const requestHeaders = new Headers(request.headers)
  const url = new URL(request.url)
  requestHeaders.set('pathname', url.pathname)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}
