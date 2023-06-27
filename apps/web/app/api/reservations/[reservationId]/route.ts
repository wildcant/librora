import { apiResponse } from '@/lib/api/server'
import { StatusCode } from '@/lib/api/server/http-status-codes'
import { getCurrentUser } from '@/lib/get-current-user'
import { Reservation, prisma } from 'database/server'
import { NextRequest } from 'next/server'

export async function GET(_req: NextRequest, { params }: { params: { reservationId: string } }) {
  const user = await getCurrentUser()
  if (!user) return apiResponse(StatusCode.UNAUTHORIZED, { errorMessage: 'Please login.' })

  const reservation = await prisma.reservation.findUnique({ where: { id: params.reservationId } })

  if (!reservation) return apiResponse(StatusCode.NOT_FOUND, { errorMessage: 'Reservation not found.' })
  if (reservation.lenderId !== user.id || reservation.borrowerId !== user.id)
    return apiResponse(StatusCode.UNAUTHORIZED, {
      errorMessage: 'You have no permission to see this reservation.',
    })

  return apiResponse<Reservation>(StatusCode.OK, { data: reservation })
}
