export interface ModalProps {
  isOpen: boolean
  onClose?: () => void
  title: string
  children: React.ReactNode
  closeInClickOut?: boolean
  hasCloseButton?: boolean
  className?: string
  ariaLabelClose?: string
}
