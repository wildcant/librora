import {
  Callback,
  ExtendedRequest,
  UserValidationExtension,
  route,
  validateUser,
} from '@/app/api/middlewares'
import { ErrorOptions, apiResponse } from '@/lib/api/server'
import { StatusCode } from '@/lib/api/server/http-status-codes'
import { ReservationMachineState, reservationMachine } from 'core'

import { ReservationStatus, prisma } from 'database/server'
import pick from 'lodash/pick'
import { NextRequest } from 'next/server'

function handleTransitionResponse(newState: ReservationMachineState): [error: ErrorOptions, newState: 'ERROR']
function handleTransitionResponse(
  newState: ReservationMachineState
): [error: undefined, newState: ReservationStatus]
function handleTransitionResponse(
  newState: ReservationMachineState
): [error: ErrorOptions | undefined, newState: ReservationStatus | 'ERROR'] {
  if (newState.value === 'ERROR') {
    if (newState.context?.error) {
      return [{ errors: [{ title: 'Invalid user input', description: newState.context.error }] }, 'ERROR']
    } else {
      return [{ errorMessage: "There was a problem processing you're request." }, 'ERROR']
    }
  } else {
    return [undefined, newState.value as ReservationStatus]
  }
}

type CancelReservation = Callback<
  ExtendedRequest<UserValidationExtension>,
  { params: { reservationId: string } }
>
const cancelReservation: CancelReservation = async (request, { params }) => {
  const reservation = await prisma.reservation.findUnique({ where: { id: params.reservationId } })
  if (!reservation) return apiResponse(StatusCode.NOT_FOUND, { errorMessage: 'Reservation not found.' })

  const transitionResponse = reservationMachine.transition(reservation.status, {
    type: 'CANCEL',
    requester: pick(request.user, 'id'),
    reservation: pick(reservation, ['borrowerId', 'start']),
  })

  const [error, mewState] = handleTransitionResponse(transitionResponse)
  if (error) return apiResponse(StatusCode.BAD_REQUEST, error)

  await prisma.reservation.update({ where: { id: reservation.id }, data: { status: 'CANCELED' } })

  return apiResponse(StatusCode.OK)
}

export const POST = (request: NextRequest) => route(request).use(validateUser).use(cancelReservation).exec()
