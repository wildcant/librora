import { withTabNavigator } from '@/app/_components/withTabNavigator'
import { getCurrentUser } from '@/lib/get-current-user'
import { prisma } from 'database/server'
import { LenderReservationsTable } from './_components/LenderReservationsTable'

async function LenderReservations() {
  const user = await getCurrentUser()
  const reservations = await prisma.reservation.findMany({
    where: { lenderId: user?.id },
    orderBy: { createdAt: 'desc' },
    include: {
      book: { include: { image: { select: { url: true } } } },
    },
  })
  return (
    <div className="container py-2">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold">{reservations.length} Reservations</h1>
      </div>

      <LenderReservationsTable reservations={reservations} className="mt-6" />
    </div>
  )
}

export default withTabNavigator(LenderReservations)('lender')
