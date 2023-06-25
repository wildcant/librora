export { default } from 'next-auth/middleware'
export const config = {
  matcher: [
    '/account-settings',
    '/personal-info',
    '/book/:path*',
    '/reservations/:path*',
    '/lending/:path*',
    '/api/reservations/:path*',
    '/api/users/:path*',
  ],
}
