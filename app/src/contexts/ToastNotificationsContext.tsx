import { ReactNode, createContext, useContext, useState } from 'react'

import { Notification, type StatusType } from 'grommet'

export type ToastNotificationsContextType = {
  setVisible: (visible: boolean) => void
  setTitle: (title: string) => void
  setMessage: (message: string) => void
  setStatus: (status: StatusType) => void
  setTime: (time: number) => void
}

export interface ToastNotificationsContextProps {
  children: ReactNode
}

const ToastNotificationsContextValue = createContext<
  ToastNotificationsContextType | undefined
>(undefined)

export const ToastNotificationsContext = ({ children }: ToastNotificationsContextProps) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [status, setStatus] = useState<StatusType | undefined>(undefined)
  const [time, setTime] = useState<number>(5000)

  const clear = () => {
    setTimeout(() => {
      setVisible(false)
      setTitle('')
      setMessage('')
      setStatus(undefined)
    }, 500)
  }

  return (
    <ToastNotificationsContextValue.Provider
      value={{ setVisible, setTitle, setMessage, setStatus, setTime }}
    >
      {children}
      {visible && (
        <Notification
          toast
          title={title}
          message={message}
          onClose={clear}
          time={time}
          status={status}
        />
      )}
    </ToastNotificationsContextValue.Provider>
  )
}

export const useToastNotificationContext = () => {
  const context = useContext(ToastNotificationsContextValue)
  if (!context) throw Error('loading context not found')
  return context
}
