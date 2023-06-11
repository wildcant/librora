import { Icon } from '@/components/icon'
import { prisma } from 'database/server'
import format from 'date-fns/format'
import Image from 'next/image'
import Link from 'next/link'
import s from './BookDetails.module.css'

// TODO: Add default image.
const defaultBookImage = ''

type BookDetailsProps = {
  params: { bookId: string }
}

export default async function BookDetails({ params }: BookDetailsProps) {
  const { title, cover, numPages, date, description, owner } = await prisma.book.findUnique({
    where: { id: params.bookId },
    include: { owner: { select: { firstName: true, lastName: true, createdAt: true } } },
  })

  return (
    <div className={s.Container}>
      <h1 className={s.Title}>{title}</h1>

      {/* {author && <p className={s.Author}>{author.name}</p>} */}

      <div className={s.Cover}>
        <Image src={cover ?? defaultBookImage} alt="book image" fill className="rounded-2xl object-cover" />
      </div>

      {/* <div className={s.Booking}>
        <BookingForm />
      </div> */}

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

      <div className={s.OwnerInfo}>
        <h3 className={s.Subtitle}>
          Lent by {owner.firstName} {owner.lastName}
        </h3>
        <span className="text-lg font-light">Joined in {format(new Date(owner.createdAt), 'MMMM yyyy')}</span>

        {/* TODO: Add link to contact book owner */}
        <Link href={`#`} className="mt-4">
          Contact Owner
        </Link>
      </div>

      {/* 
      {owner.location ? (
        <div className={s.Location}>
          <h3 className={s.Subtitle}>You&apos;ll meet in</h3>
          <p className="text-lg font-light">
            {owner.location.city}, {owner.location.country}
          </p>
          <Location {...owner.location} />
        </div>
      ) : (
        <></>
      )}
       */}
    </div>
  )
}
