import { Badge, BadgeProps } from '@/components/ui/Badge'
import { ReservationStatus } from 'database/client'

const label: { [key in ReservationStatus]: string } = {
  PENDING: ReservationStatus.PENDING.charAt(0) + ReservationStatus.PENDING.substring(1).toLowerCase(),
  CANCELED: ReservationStatus.CANCELED.charAt(0) + ReservationStatus.CANCELED.substring(1).toLowerCase(),
  DECLINED: ReservationStatus.DECLINED.charAt(0) + ReservationStatus.DECLINED.substring(1).toLowerCase(),
  APPROVED: ReservationStatus.APPROVED.charAt(0) + ReservationStatus.APPROVED.substring(1).toLowerCase(),
}

const color: { [key in ReservationStatus]: BadgeProps['variant'] } = {
  PENDING: 'yellow',
  CANCELED: 'amber',
  DECLINED: 'red',
  APPROVED: 'green',
}

type ReservationStatusBadgeProps = {
  status: ReservationStatus
}
export function ReservationStatusBadge({ status }: ReservationStatusBadgeProps) {
  return <Badge variant={color[status]}>{label[status]}</Badge>
}
