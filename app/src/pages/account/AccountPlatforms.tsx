import { Box } from 'grommet';
import { SubtractCircle } from 'grommet-icons';
import { AppButton } from '../../ui-components';
import { platforms } from '../join/NetworkSelector';
import { PlatformAccount } from '../../types';
import { PlatformUrl } from './PlatformUrl';

export interface IAccountPlatforms {
  users?: PlatformAccount[];
  remove?: (user: PlatformAccount) => void;
}

export const AccountPlatforms = (props: IAccountPlatforms) => {
  const users = props.users ? props.users : [];

  return (
    <Box>
      {users.map((user) => {
        const platform = platforms[user.platform];
        const platformName = platform ? platform.name : 'custom';

        return (
          <Box key={JSON.stringify(user)} direction="row" style={{ height: '50px', flexShrink: 0 }}>
            <Box margin={{ right: 'small' }}>{platformName}: </Box>
            <PlatformUrl user={user}></PlatformUrl>
            {props.remove !== undefined ? (
              <Box margin={{ left: 'small' }}>
                <AppButton plain onClick={() => (props.remove ? props.remove(user) : '')} icon={<SubtractCircle />} />
              </Box>
            ) : (
              <></>
            )}
          </Box>
        );
      })}
    </Box>
  );
};
