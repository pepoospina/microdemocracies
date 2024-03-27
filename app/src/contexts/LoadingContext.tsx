import { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react'

import { Box, Heading, Layer, Meter, Paragraph, Spinner } from 'grommet'

import { useThemeContext } from '../components/app'

export type LoadingContextType = {
  loading: boolean
  setLoading: (loading: boolean) => void
  setExpectedLoadingTime: (loadingTimeout: number) => void
  setTitle: (title: string) => void
  setSubtitle: (subtitle: string) => void
  setPause: (loading: boolean) => void
  setUserCanClose: (canClose: boolean) => void
  //   setIcon: (icon: any) => void;
}

export interface LoadingContextProps {
  children: ReactNode
}

const LoadingContextValue = createContext<LoadingContextType | undefined>(undefined)
const PERIOD = 100
const RATE_CHANGE_AT = 0.6

export const LoadingContext = ({ children }: LoadingContextProps) => {
  const { constants } = useThemeContext()
  const [loading, setLoading] = useState<boolean>(false)
  const [expectedLoadingTime, _setExpectedLoadingTime] = useState<number>()
  const [timeElapsed, setTimeElapsed] = useState<number>()
  const [pause, setPause] = useState<boolean>(false)
  const [userCanClose, setUserCanClose] = useState<boolean>(false)

  const timeElapsedRef = useRef<number>() // needed to prevent infinit loop effect trigger if setTimeElapsed depends on timeElapsed
  const pauseRef = useRef<boolean>() // needed to prevent infinit loop effect trigger if setTimeElapsed depends on timeElapsed

  const [title, setTitle] = useState<string>('')
  const [subtitle, setSubtitle] = useState<string>('')

  useEffect(() => {
    timeElapsedRef.current = timeElapsed
  }, [timeElapsed])

  useEffect(() => {
    pauseRef.current = pause
  }, [pause])

  /** an always-running periodic call */
  const updateTime = () => {
    if (expectedLoadingTime && timeElapsedRef.current !== undefined) {
      const ratio = timeElapsedRef.current / expectedLoadingTime
      const ratioPending = 1 - ratio
      const increment = (() => {
        if (pauseRef.current) {
          return 0
        }

        if (ratio < RATE_CHANGE_AT) {
          return PERIOD
        } else {
          // slow down as we reach the end
          return (PERIOD * ratioPending) / (1 - RATE_CHANGE_AT)
        }
      })()

      setTimeElapsed(timeElapsedRef.current + increment)
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateTime()
    }, PERIOD)

    return () => clearInterval(intervalId)
  }, [expectedLoadingTime])

  const setExpectedLoadingTime = (timeMs: number) => {
    setTimeElapsed(0)
    _setExpectedLoadingTime(timeMs)
  }

  const userClose = () => {
    if (userCanClose) {
      setLoading(false)
    }
  }

  return (
    <LoadingContextValue.Provider
      value={{
        loading,
        setLoading,
        setExpectedLoadingTime,
        setTitle,
        setSubtitle,
        setPause,
        setUserCanClose,
      }}
    >
      {children}
      {loading && (
        <Layer
          position="center"
          onClickOutside={() => userClose()}
          onEsc={() => userClose()}
          style={{ borderRadius: '4px' }}
          responsive={false}
        >
          {' '}
          <Box pad="medium" gap="small" width="medium">
            <Heading level={3} as="header" textAlign="center">
              {title}
            </Heading>

            <Paragraph>{subtitle}</Paragraph>

            {expectedLoadingTime ? (
              <Meter
                value={timeElapsed}
                color={constants.colors.primary}
                max={expectedLoadingTime}
              />
            ) : (
              <Box pad="small" justify="center" align="center">
                <Spinner color={constants.colors.primary} />
              </Box>
            )}
          </Box>
        </Layer>
      )}
    </LoadingContextValue.Provider>
  )
}

export const useLoadingContext = () => {
  const context = useContext(LoadingContextValue)
  if (!context) throw Error('loading context not found')
  return context
}
