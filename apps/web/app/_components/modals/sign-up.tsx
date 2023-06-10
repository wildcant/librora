'use client'

import { Logo } from '@/components/Logo'
import { useCustomModal } from '@/components/Modal'
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import SignUpForm from '../SignUpForm'

export const useSignUpModal = () =>
  useCustomModal({
    id: 'sign-up-modal',
    children: (
      <>
        <DialogHeader>
          <Logo />
          <DialogTitle>Welcome Back</DialogTitle>
          <DialogDescription>To continue</DialogDescription>
        </DialogHeader>
        <SignUpForm isModal />
      </>
    ),
  })
