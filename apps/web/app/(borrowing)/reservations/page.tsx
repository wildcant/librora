import { withTabNavigator } from '@/app/_components/withTabNavigator'

async function BorrowerReservations() {
  return (
    <div className="container py-10">
      <h1>Borrower Reservations</h1>
    </div>
  )
}

export default withTabNavigator(BorrowerReservations)('general')
