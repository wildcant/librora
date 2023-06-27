export const effects = {
  reservation: {
    /*
    declineReservation: (reservationId) => {
      const reservation = await prisma.reservation.findUnique({ where: { id: params.reservationId } })

      if (!reservation) return apiResponse(StatusCode.NOT_FOUND, { errorMessage: 'Reservation not found.' })
      if (reservation.lenderId !== user.id)
        return apiResponse(StatusCode.UNAUTHORIZED, {
          errorMessage: 'You have no permission to decline this reservation.',
        })

      await prisma.reservation.update({ where: { id: reservation.id }, data: { status: 'DECLINED' } })
    },
    */
  },
}
