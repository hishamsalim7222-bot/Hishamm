export interface ToastActionElement {
  altText: string
  action: React.ReactNode
}

export interface Toast {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  open?: boolean
  action?: ToastActionElement
  variant?: "default" | "destructive"
}