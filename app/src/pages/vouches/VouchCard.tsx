import { Anchor, Box, Spinner, Text } from 'grommet';
import { AppVouch } from '../../types';
import { AppButton, AppCard, AppRemainingTime } from '../../ui-components';
import { RouteNames } from '../MainPage';
import { useNavigate } from 'react-router-dom';
import { DateManager } from '../../utils/date.manager';
import { COMMUNITY_MEMBER } from '../../config/community';

interface IVouchCard {
  vouch?: AppVouch;
}

export const VoucheCard = (props: IVouchCard): JSX.Element => {
  const navigate = useNavigate();
  const vouch = props.vouch;

  const goTo = () => {
    if (vouch) {
      navigate(RouteNames.Account(vouch.to));
    }
  };

  const date = new DateManager();
  const duration = vouch ? date.durationTo(vouch.vouchDate) : undefined;
  const isFounder = vouch && vouch.from > 10e70;

  return (
    <AppButton onClick={() => goTo()} style={{ textTransform: 'none' }}>
      <AppCard>
        {vouch ? (
          <Box fill>
            {isFounder ? (
              <Text>
                <Anchor>
                  {COMMUNITY_MEMBER} #{vouch.to.toString()}
                </Anchor>{' '}
                founded the community
              </Text>
            ) : (
              <Text>
                <Anchor>
                  {COMMUNITY_MEMBER} #{vouch.from.toString()}
                </Anchor>{' '}
                vouched for{' '}
                <Anchor>
                  {COMMUNITY_MEMBER} #{vouch.to.toString()}
                </Anchor>
                {/* {' '}
              {duration ? (
                <AppRemainingTime remainingTime={duration} suffix=" ago" compactFormat></AppRemainingTime>
              ) : (
                <></>
              )} */}
              </Text>
            )}
          </Box>
        ) : (
          <Box fill align="center" justify="center">
            <Spinner></Spinner>
          </Box>
        )}
      </AppCard>
    </AppButton>
  );
};
