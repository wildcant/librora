import { Badge, BadgeProps } from '@/components/ui/Badge'
import { ReservationStatus } from 'database/client'

const label: { [key in ReservationStatus]: string } = {
  BORROWED: ReservationStatus.BORROWED.charAt(0) + ReservationStatus.BORROWED.substring(1).toLowerCase(),
  CANCELED: ReservationStatus.CANCELED.charAt(0) + ReservationStatus.CANCELED.substring(1).toLowerCase(),
  CONFIRMED: ReservationStatus.CONFIRMED.charAt(0) + ReservationStatus.CONFIRMED.substring(1).toLowerCase(),
  DECLINED: ReservationStatus.DECLINED.charAt(0) + ReservationStatus.DECLINED.substring(1).toLowerCase(),
  EXPIRED: ReservationStatus.EXPIRED.charAt(0) + ReservationStatus.EXPIRED.substring(1).toLowerCase(),
  LATE: ReservationStatus.LATE.charAt(0) + ReservationStatus.LATE.substring(1).toLowerCase(),
  PENDING: ReservationStatus.PENDING.charAt(0) + ReservationStatus.PENDING.substring(1).toLowerCase(),
  RETURNED: ReservationStatus.RETURNED.charAt(0) + ReservationStatus.RETURNED.substring(1).toLowerCase(),
  REVIEWED: ReservationStatus.REVIEWED.charAt(0) + ReservationStatus.REVIEWED.substring(1).toLowerCase(),
}

const color: { [key in ReservationStatus]: BadgeProps['variant'] } = {
  BORROWED: 'emerald',
  CANCELED: 'rose',
  CONFIRMED: 'green',
  DECLINED: 'pink',
  EXPIRED: 'orange',
  LATE: 'red',
  PENDING: 'yellow',
  RETURNED: 'teal',
  REVIEWED: 'blue',
}

type ReservationStatusBadgeProps = {
  status: ReservationStatus
}
export function ReservationStatusBadge({ status }: ReservationStatusBadgeProps) {
  return <Badge variant={color[status]}>{label[status]}</Badge>
}
