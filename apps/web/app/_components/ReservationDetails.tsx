import { GoBackButton } from '@/app/_components/GoBackButton'
import { Separator } from '@/components/ui/Separator'
import { BorrowerReservation, LenderReservation } from '@/lib/types'
import { countries } from 'database/client'
import format from 'date-fns/format'
import Image from 'next/image'

type ReservationDetailsProps = { variant: 'lender' | 'borrower' } & (
  | ({ variant: 'lender' } & LenderReservation)
  | ({ variant: 'borrower' } & BorrowerReservation)
)
export default function ReservationDetails(props: ReservationDetailsProps) {
  const { variant, id, book, status, start, end } = props

  return (
    <div className="container py-2 h-[100vh] overflow-y-auto md:h-auto md:py-4">
      <GoBackButton />
      <div>
        <span>Res ID: </span>
        <span>{id}</span>
      </div>

      <Separator className="my-4" />

      <span>{book.title}</span>
      <Image
        src={book.image.url ?? '/books/book-placeholder.webp'}
        alt="Book Image"
        width={200}
        height={300}
        className="rounded-md self-center"
      />

      <Separator className="my-4" />

      <div>
        <span>Res Status: </span>
        <span>{status}</span>
      </div>

      <div>
        <span>Start Date: </span>
        <span>{format(new Date(start), 'MMM dd')}</span>
      </div>

      <div>
        <span>End Date: </span>
        <span>{format(new Date(end), 'MMM dd')}</span>
      </div>

      <Separator className="my-4" />

      {variant === 'borrower' ? (
        <div>
          <span>Lender: </span>
          <span>
            {props.lender.firstName} {props.lender.lastName}
          </span>
        </div>
      ) : (
        <></>
      )}

      {variant === 'borrower' ? (
        <div>
          <span>Location: </span>
          <span>
            {props.lender.location
              ? `${props.lender.location?.city}, ${countries[props.lender.location.country].country}`
              : ''}
          </span>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}
