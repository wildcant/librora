// import { forgotPasswordSchema } from '@/lib/schemas/forgot-password'
// import { ApiResponse, SanitizedUser } from '@/lib/types'

// TODO: WIP
export async function POST(/*req: Request*/) {
  /*
  const { email } = forgotPasswordSchema.parse(await req.json())
  const rawUser = await prisma.user.findUnique({ where: { email }, select: { id: true, firstName: true } })
  const passwordMatched = await bcrypt.compare(password, rawUser?.password ?? '')

  const res: ApiResponse<SanitizedUser, { token: string; expires: number }> = {
    data: {
      meta: { token, expires },
    },
  }
  */
  return new Response(JSON.stringify({}), { status: 200 })
}
