import { Box, Text } from 'grommet';
import { useNavigate } from 'react-router-dom';

import { AbsoluteRoutes } from '../../route.names';
import { AppButton } from '../../ui-components';
import { SetPageTitleType } from './AppContainer';
import { ConnectedUser } from './ConnectedUser';

export const GlobalNav = (props: { title?: SetPageTitleType }) => {
  const navigate = useNavigate();
  const title = (() => {
    return (
      <Box>
        <Box>
          <Text size="small">{props.title?.prefix}</Text>
        </Box>
        <Box>
          <Text
            size="large"
            style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
            {props.title?.main}
          </Text>
        </Box>
      </Box>
    );
  })();

  const titleClicked = () => {
    navigate(AbsoluteRoutes.App);
  };

  return (
    <Box direction="row" justify="between" align="center">
      <AppButton plain onClick={() => titleClicked()}>
        {title}
      </AppButton>
      <ConnectedUser></ConnectedUser>
    </Box>
  );
};
