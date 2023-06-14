'use client'

import caribbean from '@/assets/caribbean.webp'
import europe from '@/assets/europe.webp'
import mexico from '@/assets/mexico.webp'
import spain from '@/assets/spain.webp'
import usa from '@/assets/usa.webp'
import world from '@/assets/world.jpg'
import { Logo } from '@/components/Logo'
import { useBareModal } from '@/components/Modal'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/Button'
import { Calendar } from '@/components/ui/Calendar'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/NavigationMenu'
import { Separator } from '@/components/ui/Separator'
import { cn } from '@/lib/utils'
import type { ToggleGroupImplSingleProps } from '@radix-ui/react-toggle-group'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import format from 'date-fns/format'
import isAfter from 'date-fns/isAfter'
import isBefore from 'date-fns/isBefore'
import debounce from 'lodash/debounce'
import { Search, Settings2, XCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { DateRange, SelectRangeEventHandler } from 'react-day-picker'
import s from './Header.module.css'
import { ProfileMenu } from './ProfileMenu'

const regions = [
  { label: "I'm flexible", img: world, value: 'flexible' },
  { label: 'Europe', img: europe, value: 'europe' },
  { label: 'Spain', img: spain, value: 'spain' },
  { label: 'Mexico', img: mexico, value: 'mexico' },
  { label: 'United States', img: usa, value: 'usa' },
  { label: 'Caribbean', img: caribbean, value: 'caribbean' },
]

function RegionSelector({
  value,
  onValueChange,
}: Pick<ToggleGroupImplSingleProps, 'value' | 'onValueChange'> & {}) {
  return (
    <ToggleGroup.Root
      className="flex flex-row overflow-x-scroll snap-proximity w-full absolute left-0 no-scrollbar md:relative md:grid md:grid-cols-3 md:grid-rows-2 gap-2 md:min-w-[480px]"
      type="single"
      defaultValue="center"
      aria-label="Text alignment"
      value={value}
      onValueChange={onValueChange}
    >
      {regions.map((region) => (
        <ToggleGroup.Item
          key={region.value}
          className="group min-w-[126px] snap-center first:ml-4 last:mr-4 md:first:ml-0 md:last:mr-0"
          value={region.value}
        >
          <div className="border-2 border-gray-200 rounded-lg group-data-[state=on]:border-solid group-data-[state=on]:border-black w-full">
            <Image className="object-fill w-full rounded-lg" src={region.img} alt={region.label} />
          </div>
          <span className="text-xs">{region.label}</span>
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  )
}

type SearchFormProps = {
  className?: string
}
// Reference https://codesandbox.io/s/navigation-menu-on-click-duwvgn?file=/App.js
function DesktopSearchForm({ className }: SearchFormProps) {
  const [selectedRange, setSelectedRange] = useState<DateRange>()
  const [region, setRegion] = useState<string>()
  const [fromValue, setFromValue] = useState<string>('')
  const [toValue, setToValue] = useState<string>('')
  const [value, setValue] = useState<string>('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)

  // Reference https://react-day-picker.js.org/guides/input-fields#example-range-selection
  const handleRangeSelect: SelectRangeEventHandler = (_, selectedDay) => {
    if (value === 'b') {
      let to = selectedRange?.to
      if (to && isAfter(selectedDay, to)) {
        setToValue('')
        to = undefined
      }

      setFromValue(format(selectedDay, 'MMM dd'))
      setSelectedRange({ from: selectedDay, to })
      setValue('c')
      return
    }

    if (value === 'c') {
      let from = selectedRange?.from
      if (from && isBefore(selectedDay, from)) {
        setFromValue(format(selectedDay, 'MMM dd'))
        setToValue('')
        setSelectedRange({ from: selectedDay, to: undefined })
        return
      }

      setToValue(format(selectedDay, 'MMM dd'))
      setSelectedRange({ from, to: selectedDay })
    }
  }

  const formattedDateRange = () => {
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    if (!startDate || !endDate) return null
    return `${format(new Date(startDate), 'MMM dd')} - ${format(new Date(endDate), 'MMM dd')}`
  }

  const calendar = (
    <Calendar
      mode="range"
      selected={selectedRange}
      onSelect={handleRangeSelect}
      numberOfMonths={2}
      pagedNavigation
    />
  )

  return (
    <div className={cn(className, { 'h-40': open })}>
      {open ? (
        <div className="h-full flex items-end">
          <NavigationMenu
            value={value}
            onValueChange={(v) => {
              setValue(v)
            }}
          >
            <NavigationMenuList>
              <NavigationMenuItem value="a">
                <NavigationMenuTrigger
                  onPointerMove={(event) => event.preventDefault()}
                  onPointerLeave={(event) => event.preventDefault()}
                  className="m-0 flex flex-1 flex-col items-start rounded-full py-1 hover:bg-neutral-100"
                >
                  <span className="text-xs font-light text-neutral-500">Where</span>
                  <span className="text-xs font-light text-neutral-700">
                    {region ?? 'Search Destinations'}
                  </span>
                </NavigationMenuTrigger>
                <NavigationMenuContent
                  onPointerMove={(event) => event.preventDefault()}
                  onPointerLeave={(event) => event.preventDefault()}
                >
                  <div className="p-4">
                    <span className="font-bold text-xs">Search by region</span>
                    <RegionSelector
                      value={region}
                      onValueChange={(r) => {
                        setRegion(r)
                        setValue('b')
                      }}
                    />
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem value="b">
                <NavigationMenuTrigger
                  onPointerMove={(event) => event.preventDefault()}
                  onPointerLeave={(event) => event.preventDefault()}
                  className="m-0 flex flex-1 flex-col items-start rounded-full py-1 hover:bg-neutral-100 whitespace-nowrap"
                >
                  <span className="text-xs font-light text-neutral-500">Start date</span>
                  <span className="text-xs font-light text-neutral-700">{fromValue || 'Add dates'}</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent
                  onPointerMove={(event) => event.preventDefault()}
                  onPointerLeave={(event) => event.preventDefault()}
                >
                  {calendar}
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem value="c">
                <NavigationMenuTrigger
                  onPointerMove={(event) => event.preventDefault()}
                  onPointerLeave={(event) => event.preventDefault()}
                  className="m-0 flex flex-1 flex-col items-start rounded-full py-1 hover:bg-neutral-100 whitespace-nowrap"
                >
                  <span className="text-xs font-light text-neutral-500">End date</span>
                  <span className="text-xs font-light text-neutral-700">{toValue || 'Add dates'}</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent
                  onPointerMove={(event) => event.preventDefault()}
                  onPointerLeave={(event) => event.preventDefault()}
                >
                  {calendar}
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Button className="w-8 h-8 rounded-full p-0">
                  <Search
                    size={16}
                    onClick={() => {
                      let query = '?'
                      if (region) {
                        query += `region=${region}`
                      }
                      if (selectedRange?.from && selectedRange?.to) {
                        query += `&startDate=${format(selectedRange.from, 'yyyy-MM-dd')}&endDate=${format(
                          selectedRange.to,
                          'yyyy-MM-dd'
                        )}`
                      }
                      console.log({ query })
                      router.push(query)
                      setOpen(false)
                    }}
                  />
                </Button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      ) : (
        <div className="flex shadow-md border border-solid rounded-full items-center">
          <input
            type="text"
            className={cn(s.SearchBarInput, '!pl-4')}
            autoComplete="off"
            onChange={debounce(
              (e) => (e.target.value ? router.push(`?search=${e.target.value}`) : router.push('/')),
              300
            )}
          />
          <Separator orientation="vertical" className="h-5" />
          <Button
            variant="ghost"
            className="text-sm rounded-none"
            onClick={() => {
              setOpen(true)
              setValue('a')
            }}
          >
            {searchParams.get('region') || 'Anywhere'}
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <Button
            variant="ghost"
            className="text-sm rounded-none"
            onClick={() => {
              setOpen(true)
              setValue('b')
            }}
          >
            {formattedDateRange() ?? 'Any week'}
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <Button className="w-8 h-8 rounded-full p-2 mx-2">
            <Search size={16} />
          </Button>
        </div>
      )}
    </div>
  )
}

type DesktopNavbarProps = {
  className?: string
}
function DesktopNavbar({ className }: DesktopNavbarProps) {
  return (
    <div className={cn('flex flex-row w-full justify-between items-start', className)}>
      <Link href="/" className="cursor-pointer">
        <Logo />
      </Link>

      <DesktopSearchForm />

      <ProfileMenu />
    </div>
  )
}

const useMobileSearchFormModal = () =>
  useBareModal({
    id: 'search-filters-modal',
    children: <MobileSearchForm />,
    contentProps: { hideClose: true, className: 'bg-[#f7f7f7]', containerClassName: 'p-0' },
  })

function MobileSearchForm() {
  const { close } = useMobileSearchFormModal()
  const [value, setValue] = useState<string>('b')
  const [region, setRegion] = useState<string>()
  const [selectedRange, setSelectedRange] = useState<DateRange>()
  const [fromValue, setFromValue] = useState<string>('')
  const [toValue, setToValue] = useState<string>('')

  const handleRangeSelect: SelectRangeEventHandler = (range) => {
    setSelectedRange(range)
    if (range?.from) {
      setFromValue(format(range.from, 'MMM dd'))
    } else {
      setFromValue('')
    }
    if (range?.to) {
      setToValue(format(range.to, 'MMM dd'))
    } else {
      setToValue('')
    }
  }

  const resetRangeSelect = () => {
    setFromValue('')
    setToValue('')
    setSelectedRange(undefined)
  }

  return (
    <div className="h-[100vh] w-[100vw]">
      <div className="mx-3">
        <Button variant="ghost" className="rounded-full p-0" onClick={close}>
          <XCircle className="[&>circle]:stroke-black/50 [&>circle]:stroke-[1px]" size={32} />
          <span className="sr-only">Close filters</span>
        </Button>
      </div>

      <div className="mx-2">
        <div
          className={cn('p-4 bg-white rounded-xl w-full shadow-sm flex flex-row justify-between', {
            hidden: value === 'a',
          })}
          onClick={() => setValue('a')}
        >
          <span className="text-xs text-gray-500">Where</span>
          <span className="text-xs text-gray-900 font-semibold">{region || "I'm Flexible"}</span>
        </div>

        <div
          className={cn('hidden p-4 bg-white rounded-3xl h-48 relative w-full shadow-md', {
            block: value === 'a',
          })}
        >
          <h3 className="font-bold">Where to?</h3>
          <div className="w-96 mt-2">
            <RegionSelector
              value={region}
              onValueChange={(r) => {
                setRegion(r)
                setValue('b')
              }}
            />
          </div>
        </div>
      </div>

      <div className="mx-2 mt-2">
        <div
          className={cn('p-4 bg-white rounded-xl w-full shadow-sm flex flex-row justify-between', {
            hidden: value === 'b',
          })}
          onClick={() => setValue('b')}
        >
          <span className="text-xs text-gray-500">When?</span>
          <span className="text-xs text-gray-900 font-semibold">
            {`${fromValue} - ${toValue}` || 'Add Dates'}
          </span>
        </div>

        <div
          className={cn('hidden p-4 bg-white rounded-3xl relative w-full shadow-md', {
            block: value === 'b',
          })}
        >
          <h3 className="font-bold">When</h3>
          <div className="w-96 mt-2">
            <Calendar mode="range" selected={selectedRange} onSelect={handleRangeSelect} className="p-0" />
          </div>

          <div className="flex flex-row items-center justify-between">
            <Button variant="link" onClick={resetRangeSelect}>
              Reset
            </Button>
            <Button onClick={() => console.log('TODO')}>Search</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

type SearchBarProps = {
  className?: string
}
export function MobileSearchBar({ className }: SearchBarProps) {
  const { open } = useMobileSearchFormModal()
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <div className={className}>
      <div className={s.SearchBar}>
        <div className="relative flex flex-1 flex-row items-center">
          <input
            type="text"
            className={s.SearchBarInput}
            autoComplete="off"
            defaultValue={searchParams.get('search') ?? ''}
            onChange={debounce(
              (e) => (e.target.value ? router.push(`?search=${e.target.value}`) : router.push('/')),
              300
            )}
          />
          <Icon name="search" className="absolute left-4" size="sm" />
        </div>

        <Button variant="outline" className="w-8 h-8 rounded-full p-0" onClick={open}>
          <Settings2 className="h-4 w-4" />
          <span className="sr-only">Open filters</span>
        </Button>
      </div>
    </div>
  )
}

type HeaderProps = { className?: string }
export function Header({ className }: HeaderProps) {
  return (
    <div className={className}>
      <div className="p-2">
        <DesktopNavbar className="hidden md:flex" />
        <MobileSearchBar className="md:hidden" />
      </div>
      <Separator />
    </div>
  )
}
