import {
  Callback,
  ExtendedRequest,
  Options,
  UserValidationExtension,
  route,
  validateUser,
} from '@/app/api/middlewares'
import { apiResponse } from '@/lib/api/server'
import { handleReservationTransitionResponse } from '@/lib/api/server/handle-reservation-transition'
import { StatusCode } from '@/lib/api/server/http-status-codes'
import { reservationMachine } from 'core'
import { prisma } from 'database/server'
import pick from 'lodash/pick'
import { NextRequest } from 'next/server'

type CancelReservation = Callback<
  ExtendedRequest<UserValidationExtension>,
  { params: { reservationId: string } }
>
const cancelReservation: CancelReservation = async (request, options) => {
  const reservation = await prisma.reservation.findUnique({ where: { id: options.params.reservationId } })
  if (!reservation) return apiResponse(StatusCode.NOT_FOUND, { errorMessage: 'Reservation not found.' })

  const transitionResponse = reservationMachine.transition(reservation.status, {
    type: 'CANCEL',
    requester: pick(request.user, 'id'),
    reservation: pick(reservation, ['borrowerId', 'start']),
  })

  const [error] = handleReservationTransitionResponse(transitionResponse)
  if (error) return apiResponse(StatusCode.BAD_REQUEST, error)

  await prisma.reservation.update({ where: { id: reservation.id }, data: { status: 'CANCELED' } })

  return apiResponse(StatusCode.OK)
}

export const POST = (request: NextRequest, options: Options) =>
  route(request, options).use(validateUser).use(cancelReservation).exec()
