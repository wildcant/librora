import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export default function Page() {
  // Users page is home page.
  if (headers().get('pathname') === '/') {
    redirect('/users')
  }

  return <></>
}
