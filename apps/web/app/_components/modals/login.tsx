'use client'

import { Logo } from '@/components/Logo'
import { useCustomModal } from '@/components/Modal'
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { LoginForm } from '../LoginForm'

export const useLoginModal = () =>
  useCustomModal({
    id: 'login-modal',
    children: (
      <>
        <DialogHeader>
          <Logo />
          <DialogTitle>Welcome Back</DialogTitle>
          <DialogDescription>To continue</DialogDescription>
        </DialogHeader>
        <LoginForm isModal />
      </>
    ),
  })
