import { Box } from 'grommet';
import { AppHeading } from '../../ui-components';
import { ConnectedUser } from './ConnectedUser';

export const GlobalNav = (props: { title?: string }) => {
  return (
    <Box direction="row" justify="between">
      <Box>
        <AppHeading>{props.title}</AppHeading>
      </Box>
      <ConnectedUser></ConnectedUser>
    </Box>
  );
};
