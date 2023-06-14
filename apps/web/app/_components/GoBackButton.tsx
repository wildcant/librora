'use client'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

type GoBackButtonProps = { className?: string }
export function GoBackButton({ className }: GoBackButtonProps) {
  const router = useRouter()

  return (
    <Button
      onClick={() => router.back()}
      variant="unstyled"
      className={cn('rounded-full p-0 h-auto md:hidden', className)}
    >
      <ChevronLeft />
    </Button>
  )
}
