'use client'

import { useBareModal } from '@/components/Modal'
import { Button } from '@/components/ui/Button'
import { Calendar, validateNoOverlap } from '@/components/ui/Calendar'
import { Form, FormField, FormItem } from '@/components/ui/Form'
import { useToast } from '@/components/ui/use-toast'
import { ReservationSchema } from '@/lib/schemas/reservation'
import { ApiResponse } from '@/lib/types'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Root as Portal } from '@radix-ui/react-portal'
import { DatabaseTypes } from 'database/client'
import { Interval } from 'date-fns'
import differenceInDays from 'date-fns/differenceInDays'
import format from 'date-fns/format'
import isSameDay from 'date-fns/isSameDay'
import isSameMonth from 'date-fns/isSameMonth'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import { DateRange } from 'react-day-picker'
import { DefaultValues, FormProvider, UseFormReturn, useForm, useFormContext } from 'react-hook-form'
import { z } from 'zod'
import { create } from 'zustand'

const bookingSchema = z.object({
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
})
type BookingSchema = z.infer<typeof bookingSchema>

// I can't use the form context within the modal, not a simple useState therefore I decided to use zustand.
const useDateRange = create<{ dateRange?: DateRange; setDateRange: (args: DateRange | undefined) => void }>(
  (set) => ({
    setDateRange: (dateRange) => set({ dateRange }),
  })
)

type FloatingActions = { className?: string; children?: ReactNode }
export function FloatingActions({ children, className }: FloatingActions) {
  return (
    <Portal className="pointer-events-auto">
      <div
        className={cn(
          'fixed bottom-0 left-0 z-[1001] flex items-center container gap-10 h-16 w-full justify-between border-t-[1px] border-t-neutral-100 bg-white',
          className
        )}
      >
        {children}
      </div>
    </Portal>
  )
}

type BookingDateRangeSelectorProps = { reservedIntervals: Interval[] }
function BookingDateRangeSelector({ reservedIntervals }: BookingDateRangeSelectorProps) {
  const { dateRange, setDateRange } = useDateRange()

  const formatDateRange = (dateRange?: DateRange) => {
    if (!dateRange?.from || !dateRange?.to) return null
    return `${format(dateRange.from, 'MMM dd, yyy')} - ${format(dateRange.to, 'MMM dd, yyy')}`
  }

  return (
    <>
      <div className="h-16">
        <h3 className="font-semibold text-md">Select start date</h3>
        <span>{formatDateRange(dateRange)}</span>
      </div>
      <Calendar
        mode="range"
        selected={dateRange}
        onSelect={validateNoOverlap((v) => setDateRange(v), reservedIntervals)}
        reservedIntervals={reservedIntervals}
        className="p-0"
      />
    </>
  )
}

type MobileBookingFormProps = { className?: string; reservedIntervals: Interval[] }
function MobileBookingForm({ className, reservedIntervals }: MobileBookingFormProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { dateRange, setDateRange } = useDateRange()
  const form = useFormContext() as UseFormReturn<BookingSchema>

  const bookingDateRangeModal = useBareModal({
    id: 'booking-date-range-modal',
    children: <BookingDateRangeSelector reservedIntervals={reservedIntervals} />,
    contentProps: {
      className: 'top-10 h-full rounded-t-8',
      // Avoid closing the modal when interacting with close/save actions.
      onPointerDownOutside: (e) => e.preventDefault(),
      onInteractOutside: (e) => e.preventDefault(),
    },
  })

  // Restore date range value from search params on mount.
  useEffect(() => {
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    if (startDate && endDate) {
      setDateRange({ from: new Date(startDate), to: new Date(endDate) })
    }
  }, [])

  const formatDateRange = (dateRange: DateRange) => {
    if (!dateRange?.from || !dateRange?.to) return null
    return `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd')}`
  }

  const handleSaveDateRange = () => {
    if (!dateRange?.from || !dateRange?.to) {
      console.error('TODO: Handle unexpected error.')
      return
    }
    form.setValue('dateRange', { from: dateRange.from, to: dateRange.to })
    bookingDateRangeModal.close()
    // Shallow replace won't restore scroll position see https://github.com/vercel/next.js/issues/49087
    router.replace(
      `${pathname}?startDate=${format(dateRange.from, 'yyy-MM-dd')}&endDate=${format(
        dateRange.to,
        'yyy-MM-dd'
      )}`
    )
  }

  const handleClearDateRange = () => {
    setDateRange(undefined)
    router.replace(pathname)
  }

  return (
    <FloatingActions className={className}>
      {bookingDateRangeModal.isOpen ? (
        <>
          <Button className="text-xs !p-0" variant="link" underline onClick={handleClearDateRange}>
            Clear dates
          </Button>
          <Button disabled={!dateRange?.from || !dateRange?.to} onClick={handleSaveDateRange}>
            Save
          </Button>
        </>
      ) : (
        <>
          {dateRange?.from && dateRange?.to ? (
            <>
              <Button className="text-xs !p-0" variant="link" underline onClick={bookingDateRangeModal.open}>
                {formatDateRange(dateRange)}
              </Button>
              <Button type="submit" form="booking-form">
                Reserve
              </Button>
            </>
          ) : (
            <Button className="self-center" onClick={bookingDateRangeModal.open}>
              Check Availability
            </Button>
          )}
        </>
      )}
    </FloatingActions>
  )
}

type DesktopBookingFormProps = { className?: string; reservedIntervals: Interval[] }
function DesktopBookingForm({ className, reservedIntervals }: DesktopBookingFormProps) {
  const router = useRouter()
  const pathname = usePathname()
  const form = useFormContext() as UseFormReturn<BookingSchema>

  let label
  let title = 'When do you want to have it'
  const dateRange = form.watch('dateRange')

  if (dateRange?.from && dateRange?.to) {
    const { from: start, to: end } = dateRange
    const startDate = format(start, 'MMM dd')
    const endDateIsSameMonth = isSameMonth(start, end)
    const endDate = format(end, endDateIsSameMonth ? 'dd' : 'MMM dd')
    label = `${startDate} - ${endDate}`

    if (isSameDay(start, end)) {
      title = 'You have the for one day'
    } else {
      const numberOfDays = differenceInDays(end, start)
      title = `${numberOfDays} day${numberOfDays > 1 ? 's' : ''} with the book`
    }
  }

  return (
    <div className={className}>
      <h3>{title}</h3>
      {label ? <p className="text-lg font-light">{label}</p> : <></>}

      <FormField
        control={form.control}
        name="dateRange"
        render={({ field }) => (
          <FormItem className="flex flex-col border-none">
            <Calendar
              mode="range"
              selected={field.value}
              reservedIntervals={reservedIntervals}
              onSelect={validateNoOverlap((...args) => {
                field.onChange(...args)
                const [currentDateRange] = args
                if (currentDateRange?.from && currentDateRange?.to) {
                  router.replace(
                    `${pathname}?startDate=${format(currentDateRange.from, 'yyy-MM-dd')}&endDate=${format(
                      currentDateRange.to,
                      'yyy-MM-dd'
                    )}`
                  )
                }
              }, reservedIntervals)}
              numberOfMonths={2}
              className="self-center p-0"
              pagedNavigation
            />
          </FormItem>
        )}
      />

      <div className="block self-end">
        <Button className="w-48" type="submit">
          Reserve
        </Button>
      </div>
    </div>
  )
}

type BookingFormProps = { bookId: string; reservedIntervals: Interval[] }
export function BookingForm({ bookId, reservedIntervals }: BookingFormProps) {
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  let defaultValues: DefaultValues<BookingSchema> | undefined
  if (startDate && endDate) {
    defaultValues = {
      dateRange: {
        from: new Date(startDate),
        to: new Date(endDate),
      },
    }
  }
  const form = useForm<BookingSchema>({ resolver: zodResolver(bookingSchema), defaultValues })

  // TODO: submit booking endpoint and handler.
  const submitBooking = async (data: BookingSchema) => {
    const { from, to } = data.dateRange
    const reservationData: ReservationSchema = {
      bookId: bookId,
      dateRange: { start: from, end: to },
    }
    const response = await fetch('/api/reservations', {
      method: 'post',
      body: JSON.stringify(reservationData),
    })
    const apiResponse: ApiResponse<DatabaseTypes.Reservation> = await response.json()

    if ('errors' in apiResponse) {
      toast({
        title: apiResponse.errors[0]?.title,
        description: apiResponse.errors[0]?.detail,
      })
      return
    }

    if (!response.ok) {
      toast({
        title: 'There was a problem',
        description: 'Please contact an administrator.',
      })
      return
    }
  }

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitBooking)} id="booking-form">
          <MobileBookingForm className="md:hidden" reservedIntervals={reservedIntervals} />
          <DesktopBookingForm className="hidden md:block" reservedIntervals={reservedIntervals} />
        </form>
      </Form>
    </FormProvider>
  )
}
