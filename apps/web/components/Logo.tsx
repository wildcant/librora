import { clsx } from 'clsx'
import { ComponentPropsWithoutRef } from 'react'

type LogoProps = ComponentPropsWithoutRef<'h5'>
export function Logo({ className, ...props }: LogoProps) {
  return (
    <h5
      className={clsx('font-merienda text-primary-900 text-[26px] font-bold text-primary', className)}
      {...props}
    >
      Librora
    </h5>
  )
}
