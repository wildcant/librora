export { default } from 'next-auth/middleware'
export const config = {
  matcher: ['/account-settings', '/personal-info', '/reservations/:path*', '/lending/:path*'],
}
