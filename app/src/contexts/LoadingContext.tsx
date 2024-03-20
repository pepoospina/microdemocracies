import { Box, Heading, Layer, Meter, Paragraph, Spinner } from 'grommet'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'

export type LoadingContextType = {
  loading: boolean
  setLoading: (loading: boolean) => void
  setLoadingTimeout: (loadingTimeout: boolean) => void
  setTitle: (title: string) => void
  setSubtitle: (subtitle: string) => void
  //   setIcon: (icon: any) => void;
}

export interface LoadingContextProps {
  children: ReactNode
}

const LoadingContextValue = createContext<LoadingContextType | undefined>(undefined)

export const LoadingContext = ({ children }: LoadingContextProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingTimeout, setLoadingTimeout] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [subtitle, setSubtitle] = useState<string>('')
  //   const [icon, setIcon] = useState();

  const [meterValue, setMeterValue] = useState<number>(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMeterValue((oldValue) => {
        if (oldValue === 100) return 0
        return Math.min(oldValue + Math.random() * 10, 100)
      })
    }, 500)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <LoadingContextValue.Provider value={{ loading, setLoading, setLoadingTimeout, setTitle, setSubtitle }}>
      {children}
      {loading && (
        <Layer
          position="center"
          onClickOutside={() => setLoading(false)}
          onEsc={() => setLoading(false)}
          style={{ border: '3px solid #1a1a1a', borderRadius: '10px' }}
        >
          <Box pad="medium" gap="small" width="medium">
            <Heading level={3} as="header" textAlign="center">
              {title}
            </Heading>

            <Paragraph>{subtitle}</Paragraph>

            {loadingTimeout ? (
              <Meter value={meterValue} color="#1a1a1a" />
            ) : (
              <Box pad="small" justify="center" align="center">
                <Spinner color="#1a1a1a" />
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
