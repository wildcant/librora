import { withTabNavigator } from '@/app/_components/withTabNavigator'
import { prisma } from 'database/server'
import { BorrowerReservationsTable } from './_components/ReservationsTable'
import { getCurrentUser } from '@/lib/get-current-user'

async function BorrowerReservations() {
  const user = await getCurrentUser()
  const reservations = await prisma.reservation.findMany({
    where: { borrowerId: user?.id },
    include: {
      book: { include: { image: { select: { url: true } } } },
      lender: { include: { location: true } },
    },
  })
  return (
    <div className="container py-2">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">{reservations.length} Reservations</h1>
      </div>

      <BorrowerReservationsTable reservations={reservations} className="mt-6" />
    </div>
  )
}

export default withTabNavigator(BorrowerReservations)('general')
