'use client'

import { Button } from '@/components/ui/Button'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function GoBackButton() {
  const router = useRouter()

  return (
    <Button onClick={() => router.back()} variant="unstyled" className="rounded-full p-0 h-auto md:hidden">
      <ChevronLeft />
    </Button>
  )
}
