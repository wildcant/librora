import clsx from 'clsx'
import { ComponentPropsWithoutRef } from 'react'
import s from './Progress.module.css'

type ProgressProps = ComponentPropsWithoutRef<'progress'>

export function Progress({ className, ...props }: ProgressProps) {
  return <progress className={clsx(s.Progress, s.primary, className)} {...props} />
}
