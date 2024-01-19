import { Box } from 'grommet';

export const LoadingDiv = (props: { height?: string; width?: string }) => {
  return <Box style={{ height: props.height || '22px', width: props.width || '150px' }}></Box>;
};
