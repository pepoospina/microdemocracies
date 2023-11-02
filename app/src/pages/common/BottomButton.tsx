import { Box } from 'grommet';
import { AppButton, IButton } from '../../ui-components';
import { useResponsive } from '../../components/app';

export const BottomButton = (props: IButton) => {
  const { vw } = useResponsive();
  const maxWidth = vw < 500 ? 'auto' : '200px';
  const marginLeft = vw < 500 ? '0px' : '3vw';

  return (
    <Box style={{ maxWidth, marginLeft }}>
      <AppButton {...props}></AppButton>
    </Box>
  );
};
