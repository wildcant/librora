import { GoBackButton } from '@/app/_components/GoBackButton'
import { Icon } from '@/components/icon'
import { countries } from 'database/client'
import { prisma } from 'database/server'
import format from 'date-fns/format'
import Image from 'next/image'
import Link from 'next/link'
import s from './BookDetails.module.css'
import { BookingForm } from './_components/BookingForm'
import { Location } from './_components/Location'

type BookDetailsProps = {
  params: { bookId: string }
}

export default async function BookDetails({ params }: BookDetailsProps) {
  const book = await prisma.book.findUnique({
    where: { id: params.bookId },
    include: {
      owner: { select: { firstName: true, lastName: true, location: true, createdAt: true } },
      reservations: {
        // Get the book calendar blocked intervals.
        where: { status: { notIn: ['PENDING', 'CANCELED', 'DECLINED', 'EXPIRED'] } },
        select: { start: true, end: true },
      },
      image: true,
    },
  })

  if (!book) return <div>Not found.</div>

  const { title, image, numPages, date, description, owner, author, reservations: reservedIntervals } = book

  return (
    <main className={s.Container}>
      <GoBackButton className="back-button w-fit" />
      <h1 className={s.Title}>{title}</h1>

      {author && <p className={s.Author}>{author}</p>}

      <div className={s.Cover}>
        <Image
          src={image.url ?? '/books/book-placeholder.webp'}
          alt="book image"
          fill
          className="rounded-2xl object-cover"
        />
      </div>

      <div className={s.QuickFacts}>
        <h3 className={s.Subtitle}>Quick Facts</h3>
        <div>
          <div className="mt-2 flex items-center gap-2">
            <Icon name="pages" />
            <p className="text-md">Number of pages: {numPages}</p>
          </div>

          {/* <div className="mt-2 flex items-center gap-2">
            <Icon name="earth" />
            <p className="text-md">Language: {language}</p>
          </div> */}

          <div className="mt-2 flex items-center gap-2">
            <Icon name="time-line" />
            <p className="text-md">Published at {format(new Date(date), 'yyyy')}</p>
          </div>
        </div>
      </div>

      <div className={s.Description}>
        <h3 className={s.Subtitle}>About this book</h3>
        <p className="text-md font-light">{description}</p>
      </div>

      <div className={s.Booking}>
        <BookingForm bookId={book.id} reservedIntervals={reservedIntervals} />
      </div>

      {owner && (
        <div className={s.OwnerInfo}>
          <h3 className={s.Subtitle}>
            Lent by {owner.firstName} {owner.lastName}
          </h3>
          <span className="text-lg font-light">
            Joined in {format(new Date(owner.createdAt), 'MMMM yyyy')}
          </span>

          {/* TODO: Add link to contact book owner */}
          <Link href={`#`} className="mt-4">
            Contact Owner
          </Link>
        </div>
      )}

      {owner.location ? (
        <div className={s.Location}>
          <h3 className={s.Subtitle}>You&apos;ll meet in</h3>
          <p className="text-lg font-light mb-2">
            {owner.location.city}, {countries[owner.location.country].country}
          </p>
          <Location country={owner.location.country} />
        </div>
      ) : (
        <></>
      )}
    </main>
  )
}
