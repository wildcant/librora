import { GoBackButton } from '@/app/_components/GoBackButton'
import { Separator } from '@/components/ui/Separator'
import { countries } from 'database/client'
import { prisma } from 'database/server'
import format from 'date-fns/format'
import Image from 'next/image'

export default async function BorrowerReservationDetails({ params }: { params: { reservationId: string } }) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: params.reservationId },
    include: { book: { include: { image: true } }, lender: { include: { location: true } } },
  })

  if (!reservation) return <div>Reservation with id {params.reservationId} not found.</div>
  const { location } = reservation.lender
  return (
    <div className="container py-2 h-[100vh] overflow-y-auto md:h-auto md:py-4">
      <GoBackButton />
      <div>
        <span>Res ID: </span>
        <span>{reservation.id}</span>
      </div>

      <Separator className="my-4" />

      <span>{reservation.book.title}</span>
      <Image
        src={reservation?.book.image.url ?? '/books/book-placeholder.webp'}
        alt="Book Image"
        width={200}
        height={300}
        className="rounded-md self-center"
      />

      <Separator className="my-4" />

      <div>
        <span>Res Status: </span>
        <span>{reservation.status}</span>
      </div>

      <div>
        <span>Start Date: </span>
        <span>{format(new Date(reservation.start), 'MMM dd')}</span>
      </div>

      <div>
        <span>End Date: </span>
        <span>{format(new Date(reservation.start), 'MMM dd')}</span>
      </div>

      <Separator className="my-4" />

      <div>
        <span>Lender: </span>
        <span>
          {reservation.lender.firstName} {reservation.lender.lastName}
        </span>
      </div>

      <div>
        <span>Location: </span>
        <span>{location ? `${location?.city}, ${countries[location.country].country}` : ''}</span>
      </div>
    </div>
  )
}
