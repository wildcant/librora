'use client'

import { Button, ButtonProps } from '@/components/ui/Button'
import { Dialog, DialogContent, DialogContentProps, DialogHeader, DialogProps } from '@/components/ui/Dialog'
import { cn } from '@/lib/utils'
import { createContext } from 'hooks'
import { ComponentPropsWithoutRef, PropsWithChildren, ReactNode, useState } from 'react'

type ModalProviderProps = {
  modals: ModalProps[]
  openModal: (id: ModalProps) => void
  setModalIsLoading: (id: string, isLoading: boolean) => void
  closeModal: (id: string) => void
  isModalLoading: (id: string) => boolean
}

const [Provider, useContext] = createContext<ModalProviderProps>({
  name: 'ModalContext',
  hookName: 'useModalContext',
  providerName: 'ModalProvider',
})

type ModalVariant = 'confirmation' | 'custom' | 'bare'

type ModalProps = {
  id: string
  variant: ModalVariant
  isLoading?: boolean
  titleProps?: ComponentPropsWithoutRef<'p'>
  children?: ReactNode
  primaryProps?: ButtonProps
  secondaryProps?: ButtonProps
  dialogProps?: Omit<DialogProps, 'open' | 'onOpenChange'>
  contentProps?: DialogContentProps
  onClose?: () => void
}

function getTitleContent(variant: ModalVariant, children: ReactNode) {
  if (children) {
    return children
  }
  switch (variant) {
    case 'confirmation':
    default:
      return 'Aviso'
  }
}

function getModalContent(variant: ModalVariant, children: ReactNode) {
  if (children) {
    return children
  }
  switch (variant) {
    case 'confirmation':
    default:
      return '¿Estás seguro?'
  }
}

function Modal(props: ModalProps) {
  const {
    id,
    variant,
    titleProps,
    primaryProps,
    secondaryProps,
    children,
    dialogProps,
    contentProps = {},
    onClose,
  } = props

  const { modals, closeModal } = useModalContext()

  const modal = modals.find((m) => m.id === id)
  const isConfirmation = variant === 'confirmation'
  const isBare = variant === 'bare'
  return (
    <Dialog
      open={!!modal}
      onOpenChange={(open) => {
        if (!open) {
          onClose?.()
          closeModal(id)
        }
      }}
      {...dialogProps}
    >
      <DialogContent className={cn('sm:max-w-[425px]', contentProps.className)} {...contentProps}>
        {isBare ? (
          children
        ) : (
          <>
            {isConfirmation && (
              <DialogHeader>
                <p className="text-gray-700" {...titleProps}>
                  {getTitleContent(variant, titleProps?.children)}
                </p>
              </DialogHeader>
            )}
            {getModalContent(variant, children)}
            {isConfirmation && (
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  color="primary"
                  size="sm"
                  {...primaryProps}
                  disabled={primaryProps?.disabled || modal?.isLoading}
                >
                  {primaryProps?.children ?? 'Confirmar'}
                </Button>
                <Button
                  color="primary"
                  onClick={() => closeModal(id)}
                  size="sm"
                  variant="ghost"
                  {...secondaryProps}
                  disabled={secondaryProps?.disabled || modal?.isLoading}
                >
                  {secondaryProps?.children ?? 'Cancelar'}
                </Button>
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export const useModalContext = useContext
export function ModalProvider({ children }: PropsWithChildren) {
  const [modals, setModals] = useState<ModalProps[]>([])

  const openModal = (modal: ModalProps) =>
    setModals((currentModals) => {
      const modalIndex = currentModals.findIndex((m) => m.id === modal.id)
      // Add the modal if it doesn't exist.
      if (modalIndex === -1) {
        return [...currentModals, modal]
      }
      return currentModals
    })

  const closeModal = (id: string) => {
    const { onClose } = modals.find((modal) => modal.id === id) ?? {}
    onClose?.()
    setModals((currentModals) => currentModals.filter((modal) => modal.id !== id))
  }

  const setModalIsLoading = (id: string, isLoading: boolean) =>
    setModals((currentModals) => {
      const updatedModals = [...currentModals]
      const modalIndex = currentModals.findIndex((modal) => modal.id === id)
      // If the modal exist update isLoading flag.
      if (modalIndex !== -1) {
        updatedModals[modalIndex]!.isLoading = isLoading
      }
      return updatedModals
    })

  const isModalLoading = (id: string) => !!modals.find((modal) => modal.id === id)?.isLoading

  return (
    <Provider
      value={{
        modals,
        openModal,
        closeModal,
        setModalIsLoading,
        isModalLoading,
      }}
    >
      {children}
      {modals.map((props) => (
        <Modal key={props.id} {...props} />
      ))}
    </Provider>
  )
}

type UseConfirmationModalProps = Pick<
  ModalProps,
  'id' | 'titleProps' | 'children' | 'primaryProps' | 'secondaryProps' | 'isLoading' | 'dialogProps'
>

export function useConfirmationModal(props: UseConfirmationModalProps) {
  const { openModal, closeModal } = useModalContext()
  return {
    open: () => openModal({ variant: 'confirmation', ...props }),
    close: () => closeModal(props.id),
  }
}

type UseCustomModalProps = Pick<
  ModalProps,
  'id' | 'children' | 'isLoading' | 'dialogProps' | 'onClose' | 'contentProps'
>

export function useCustomModal(props: UseCustomModalProps) {
  const { openModal, closeModal, modals } = useModalContext()
  return {
    isOpen: !!modals.find((m) => m.id === props.id),
    open: () => openModal({ variant: 'custom', ...props }),
    close: () => closeModal(props.id),
  }
}

type UseBareModalProps = Pick<
  ModalProps,
  'id' | 'children' | 'isLoading' | 'dialogProps' | 'onClose' | 'contentProps'
>

export function useBareModal(props: UseBareModalProps) {
  const { openModal, closeModal, modals } = useModalContext()

  return {
    isOpen: !!modals.find((m) => m.id === props.id),
    open: () => openModal({ variant: 'bare', ...props }),
    close: () => closeModal(props.id),
  }
}
