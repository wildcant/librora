// import { forgotPasswordSchema } from '@/lib/schemas/forgot-password'
// import { FetchResourceResponse, SanitizedUser } from '@/lib/types'

export async function POST(/*req: Request*/) {
  /*
  const { email } = forgotPasswordSchema.parse(await req.json())
  const rawUser = await prisma.user.findUnique({ where: { email }, select: { id: true, firstName: true } })
  const passwordMatched = await bcrypt.compare(password, rawUser?.password ?? '')

  const res: FetchResourceResponse<SanitizedUser, { token: string; expires: number }> = {
    data: {
      meta: { token, expires },
    },
  }
  */
  return new Response(JSON.stringify({}), { status: 200 })
}
