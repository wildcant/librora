import { apiResponse } from '@/lib/api/server'
import { StatusCode } from '@/lib/api/server/http-status-codes'
import { getCurrentUser } from '@/lib/get-current-user'
import { prisma } from 'database/server'

export async function POST(_req: Request, { params }: { params: { reservationId: string } }) {
  const user = await getCurrentUser()
  if (!user) return apiResponse(StatusCode.UNAUTHORIZED, { errorMessage: 'Please login.' })

  const reservation = await prisma.reservation.findUnique({ where: { id: params.reservationId } })

  if (!reservation) return apiResponse(StatusCode.NOT_FOUND, { errorMessage: 'Reservation not found.' })
  if (reservation.borrowerId !== user.id)
    return apiResponse(StatusCode.UNAUTHORIZED, {
      errorMessage: 'You have no permission to cancel this reservation.',
    })

  await prisma.reservation.update({ where: { id: reservation.id }, data: { status: 'CANCELED' } })

  return apiResponse(StatusCode.OK)
}
