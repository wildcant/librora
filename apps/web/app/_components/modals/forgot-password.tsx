'use client'

import { useCustomModal } from '@/components/Modal'
import ForgotPasswordForm from '../ForgotPasswordForm'

export const useForgotPasswordModal = () =>
  useCustomModal({
    id: 'forgot-password-modal',
    children: (
      <>
        <ForgotPasswordForm />
      </>
    ),
  })
