import {
  Callback,
  ExtendedRequest,
  UserValidationExtension,
  route,
  validateUser,
} from '@/app/api/middlewares'
import { apiResponse } from '@/lib/api/server'
import { StatusCode } from '@/lib/api/server/http-status-codes'
import { prisma } from 'database/server'
import { NextRequest } from 'next/server'

type ConfirmReservation = Callback<
  ExtendedRequest<UserValidationExtension>,
  { params: { reservationId: string } }
>
const confirmReservation: ConfirmReservation = async (_req, { params }) => {
  const reservation = await prisma.reservation.findUnique({ where: { id: params.reservationId } })
  if (!reservation) return apiResponse(StatusCode.NOT_FOUND, { errorMessage: 'Reservation not found.' })
  await prisma.reservation.update({ where: { id: reservation.id }, data: { status: 'CONFIRMED' } })
  return apiResponse(StatusCode.OK)
}

export const POST = (request: NextRequest) => route(request).use(validateUser).use(confirmReservation).exec()
