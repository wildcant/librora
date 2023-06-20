import { withTabNavigator } from '@/app/_components/withTabNavigator'

async function LenderReservations() {
  return (
    <div className="container py-10">
      <h1>Lender Reservations</h1>
    </div>
  )
}

export default withTabNavigator(LenderReservations)('lender')
