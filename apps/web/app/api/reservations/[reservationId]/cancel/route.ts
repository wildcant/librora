import { apiResponse } from '@/lib/api/server'
import { StatusCode } from '@/lib/api/server/http-status-codes'
import { getCurrentUser } from '@/lib/get-current-user'
import { reservationMachine } from 'core'
import { prisma } from 'database/server'
import pick from 'lodash/pick'
import { NextRequest } from 'next/server'

export async function POST(_req: NextRequest, { params }: { params: { reservationId: string } }) {
  const user = await getCurrentUser()
  if (!user) return apiResponse(StatusCode.UNAUTHORIZED, { errorMessage: 'Please login.' })

  const reservation = await prisma.reservation.findUnique({ where: { id: params.reservationId } })

  if (!reservation) return apiResponse(StatusCode.NOT_FOUND, { errorMessage: 'Reservation not found.' })
  if (reservation.borrowerId !== user.id)
    return apiResponse(StatusCode.UNAUTHORIZED, {
      errorMessage: 'You have no permission to cancel this reservation.',
    })

  const newState = reservationMachine.transition(reservation.status, {
    type: 'CANCEL',
    requester: pick(user, 'id'),
    reservation: pick(reservation, ['borrowerId', 'start']),
  })

  if (newState.value === 'ERROR') {
    if (newState.context?.error) {
      return apiResponse(StatusCode.BAD_REQUEST, {
        errors: [{ title: 'Invalid user input', description: newState.context.error }],
      })
    } else {
      return apiResponse(StatusCode.INTERNAL_SERVER_ERROR, {
        errorMessage: "There was a problem processing you're request.",
      })
    }
  }

  await prisma.reservation.update({ where: { id: reservation.id }, data: { status: 'CANCELED' } })

  return apiResponse(StatusCode.OK)
}
