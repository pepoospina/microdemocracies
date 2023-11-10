import { Box, Button } from 'grommet';
import { AppButton } from '../ui-components';

export const TestComponent = () => {
  return (
    <Box>
      <Button label="hi" primary></Button>
      <AppButton label="hi" primary></AppButton>
    </Box>
  );
};
