'use client'

import { Card, CardContent, CardProps } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { Book } from '@/lib/types'
import { cn } from '@/lib/utils'
import format from 'date-fns/format'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

type BookCardProps = CardProps & { book: Book; className?: string }
export function BookCard({ book, className, ...props }: BookCardProps) {
  const [imageLoading, setImageLoading] = useState(true)

  return (
    <Card key={book.id} className={cn('border-0 shadow-none min-h-[435px]', className)} {...props}>
      <Link href={`/book/${book.id}`}>
        <CardContent className="p-0 h-full hover:bg-gray-50">
          <div className="flex flex-col cursor-pointer h-full">
            {book.image && (
              <div className="w-[100%] h-64 relative">
                <Image
                  key={book.id}
                  src={book.image.url}
                  alt="book"
                  fill
                  className={cn('object-cover rounded-md')}
                  onLoadingComplete={() => setImageLoading(false)}
                />
                <Skeleton className={cn('h-full w-full', { hidden: !imageLoading })} />
              </div>
            )}

            <div className="p-1  flex flex-1 flex-col justify-between lg:p-2">
              <h1 className="text-xs font-normal lg:text-sm line-clamp-3">{book.title}</h1>
              <h5 className="text-xs font-bold text-secondary-600">{format(new Date(book.date), 'yyyy')}</h5>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
