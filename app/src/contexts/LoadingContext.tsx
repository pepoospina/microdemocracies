import { Box, Layer, Text } from 'grommet';
import { ReactNode, createContext, useContext, useState } from 'react';

export type LoadingContextType = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setLoadingTimeout: (loadingTimeout: number) => void;
  setTitle: (title: string) => void;
  setSubtitle: (subtitle: string) => void;
  //   setIcon: (icon: any) => void;
};

export interface LoadingContextProps {
  children: ReactNode;
}

const LoadingContextValue = createContext<LoadingContextType | undefined>(
  undefined
);

export const LoadingContext = ({ children }: LoadingContextProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTimeout, setLoadingTimeout] = useState<number | null>(null);
  const [title, setTitle] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');
  //   const [icon, setIcon] = useState();

  console.log({ loading });

  return (
    <LoadingContextValue.Provider
      value={{ loading, setLoading, setLoadingTimeout, setTitle, setSubtitle }}>
      {children}
      {loading && (
        <Layer onClickOutside={() => setLoading(false)}>
          <Box>
            <Text>{title}</Text>
          </Box>

          <Box>
            <Text>{subtitle}</Text>
          </Box>
          
          <Text>Is LOADING </Text>
        </Layer>
      )}
    </LoadingContextValue.Provider>
  );
};

export const useLoadingContext = () => {
  const context = useContext(LoadingContextValue);
  if (!context) throw Error('loading context not found');
  return context;
};
