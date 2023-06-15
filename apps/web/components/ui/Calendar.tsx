'use client'

import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { Interval } from 'date-fns'
import addYears from 'date-fns/addYears'
import areIntervalsOverlapping from 'date-fns/areIntervalsOverlapping'
import endOfYesterday from 'date-fns/endOfYesterday'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import startOfMonth from 'date-fns/startOfMonth'
import subMonths from 'date-fns/subMonths'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'
import { DateRange, DayPicker, SelectRangeEventHandler } from 'react-day-picker'

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  reservedIntervals?: Interval[]
}

/**
 * Won't call `onSelect` callback if the given `selectedRange` overlaps with the any of the given `disabledDateRanges`
 * Use as a high order function when working with range calendars.
 * @example
 *      <Calendar
 *        mode="range"
 *        onSelect={validateNoOverlap(handleSelect, reservedIntervals)}
 *      />
 */
export const validateNoOverlap =
  (onSelect: SelectRangeEventHandler, disabledDateRanges: Interval[]): SelectRangeEventHandler =>
  (...args) => {
    const [selectedRange] = args
    if (selectedRange?.from && selectedRange?.to) {
      const newRangeOverlap = disabledDateRanges?.some((disabledDateRange) =>
        areIntervalsOverlapping(disabledDateRange, { start: selectedRange.from!, end: selectedRange.to! })
      )
      if (!newRangeOverlap) {
        onSelect(...args)
      }
    } else {
      onSelect(...args)
    }
  }

export function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  reservedIntervals,
  ...props
}: CalendarProps) {
  const initialDisabledRanges = React.useMemo(() => {
    const past: DateRange = { from: startOfMonth(new Date()), to: endOfYesterday() }
    const reservedDateRanges: DateRange[] =
      reservedIntervals?.map(({ start, end }) => ({ from: new Date(start), to: new Date(end) })) ?? []
    return reservedDateRanges.concat(past)
  }, [reservedIntervals])

  const [disabledRanges, setDisabledRanges] = React.useState(initialDisabledRanges)

  React.useEffect(() => {
    if (props.mode === 'range' && !!reservedIntervals?.length) {
      // When the user sets the start date the calendar disable all dates that could overlap with reserved date ranges.
      if (props.selected?.from && !props.selected?.to) {
        // Find closest unavailable date to the selected start date to left.
        let leftLimit =
          reservedIntervals
            .map(({ end }) => end)
            .filter((endDate) => isAfter(props.selected?.from!, endDate))
            .sort((a, b) => +b - +a)[0] ?? endOfYesterday()

        // Find closest unavailable date to the selected start date to the right.
        const rightLimit = reservedIntervals
          .map(({ start }) => start)
          .filter((startDate) => isBefore(props.selected?.from!, startDate))
          .sort((a, b) => +a - +b)[0]

        const dynamicDisabledDateRanges: DateRange[] = [
          { from: startOfMonth(new Date()), to: new Date(leftLimit) },
        ]
        if (rightLimit) {
          dynamicDisabledDateRanges.push({ from: new Date(rightLimit), to: addYears(new Date(), 2) })
        }

        setDisabledRanges(dynamicDisabledDateRanges)

        // Reset disabled dates to initial value when setting both `from and `to` dates or none.
      } else if (!props.selected?.from || (props.selected?.from && props.selected?.to)) {
        setDisabledRanges((currentDisabledRanges) =>
          currentDisabledRanges !== initialDisabledRanges ? initialDisabledRanges : currentDisabledRanges
        )
      }
    }
  }, [props.mode, props.selected, reservedIntervals, initialDisabledRanges])

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        // TODO: Add rounded border to start and end cells.
        cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-3xl last:[&:has([aria-selected])]:rounded-r-3xl [&:has(class=rdp-day_range_end)]:rounded-r-3xl focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-3xl hover:border hover:border-solid hover:border-primary hover:bg-transparent '
        ),
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary focus:bg-primary focus:text-primary-foreground rounded-3xl',
        day_outside: 'text-muted-foreground opacity-50',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      disabled={disabledRanges}
      modifiersClassNames={{ disabled: 'line-through' }}
      fromMonth={startOfMonth(new Date())}
      toMonth={startOfMonth(subMonths(addYears(new Date(), 2), 1))}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'
