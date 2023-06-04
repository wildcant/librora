'use client'

import { createContext } from '@/hooks/context'
import { PropsWithChildren, ReactNode, useState } from 'react'

type ModalProps = {
  id: string
  loading?: boolean
  title?: string
  primaryButtonProps?: { text?: string; onClick: () => void }
  secondaryButtonProps?: { text?: string }
  children?: ReactNode
  content?: string
  onClose?: () => void
}
function Modal(props: ModalProps) {
  const {
    id,
    loading,
    title = 'Confirm your action',
    primaryButtonProps = { text: 'Confirm', onClick: () => {} },
    secondaryButtonProps = { text: 'Cancel' },
    children,
    content = 'Are you sure you want to proceed?',
    onClose,
  } = props
  const { modals, closeModal } = useModalContext()

  const handleClose = () => {
    onClose?.()
    closeModal(id)
  }

  const isOpen = !!modals.find((m) => m.id === id)

  return (
    <dialog open={isOpen}>
      <article className="modal" style={{ paddingBottom: 6 }}>
        <header style={{ paddingBottom: 6 }}>
          <button aria-label="Close" className="close icon-button" onClick={handleClose} disabled={loading} />
          {title}
        </header>
        <div>
          {children}
          {content}
        </div>
        <div className="row col-xs-offset-3 col-xs-9" style={{ marginTop: '3rem' }}>
          {primaryButtonProps ? (
            <button
              className="col-xs-offset-1 col-xs-5"
              onClick={primaryButtonProps?.onClick}
              aria-busy={loading}
              disabled={loading}
            >
              {primaryButtonProps?.text}
            </button>
          ) : (
            <></>
          )}

          {secondaryButtonProps ? (
            <button
              className="col-xs-offset-1 col-xs-5 secondary outline"
              onClick={handleClose}
              disabled={loading}
            >
              {secondaryButtonProps?.text}
            </button>
          ) : (
            <></>
          )}
        </div>
      </article>
    </dialog>
  )
}

type ModalProviderProps = {
  modals: ModalProps[]
  openModal: (id: ModalProps) => void
  setModalLoading: (id: string, loading: boolean) => void
  closeModal: (id: string) => void
  isModalLoading: (id: string) => boolean
}

const [Provider, useContext] = createContext<ModalProviderProps>({
  name: 'ModalContext',
  hookName: 'useModalContext',
  providerName: 'ModalProvider',
})
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

  const setModalLoading = (id: string, loading: boolean) =>
    setModals((currentModals) => {
      const updatedModals = [...currentModals]
      const modalIndex = currentModals.findIndex((modal) => modal.id === id)
      // If the modal exist update loading flag.
      if (modalIndex !== -1) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        updatedModals[modalIndex]!.loading = loading
      }
      return updatedModals
    })

  const isModalLoading = (id: string) => !!modals.find((modal) => modal.id === id)?.loading

  return (
    <Provider
      value={{
        modals,
        openModal,
        closeModal,
        setModalLoading,
        isModalLoading,
      }}
    >
      {modals.map((props) => (
        <Modal key={props.id} {...props} />
      ))}
      {children}
    </Provider>
  )
}

type UseCModalProps = Pick<
  ModalProps,
  'id' | 'children' | 'primaryButtonProps' | 'secondaryButtonProps' | 'loading' | 'content'
>

export function useModal(props: UseCModalProps) {
  const { openModal, closeModal, setModalLoading } = useModalContext()
  return {
    open: () => openModal(props),
    close: () => closeModal(props.id),
    setLoading: (loading: boolean) => setModalLoading(props.id, loading),
  }
}
