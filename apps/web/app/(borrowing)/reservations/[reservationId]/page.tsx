import ReservationDetails from '@/app/_components/ReservationDetails'
import { getCurrentUser } from '@/lib/get-current-user'
import { prisma } from 'database/server'

export default async function BorrowerReservationDetails({ params }: { params: { reservationId: string } }) {
  const user = await getCurrentUser()
  const reservation = await prisma.reservation.findUnique({
    where: { id: params.reservationId },
    include: { book: { include: { image: true } }, lender: { include: { location: true } } },
  })

  if (!reservation || reservation.borrowerId !== user?.id)
    return <div>Reservation with id {params.reservationId} not found.</div>

  return <ReservationDetails variant="borrower" {...reservation} />
}
