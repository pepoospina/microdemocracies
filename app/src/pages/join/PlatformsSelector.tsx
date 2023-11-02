import { Box } from 'grommet';
import { NetworkSelector } from './NetworkSelector';
import { useEffect, useState } from 'react';
import { AppHeading } from '../../ui-components';

import { PlatformAccount } from '../../types';
import { AccountPlatforms } from '../account/AccountPlatforms';

export interface IPlatformsSelector {
  onChange: (platforms: PlatformAccount[]) => any;
}

export const AppPlatformsSelector = (props: IPlatformsSelector) => {
  const [users, setUsers] = useState<PlatformAccount[]>([]);

  useEffect(() => {
    props.onChange(users);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  const selected = (user: PlatformAccount) => {
    setUsers((users) => [...users, user]);
  };

  const remove = (user: PlatformAccount) => {
    const index = users.findIndex((u) => u.platform === user.platform && u.username === user.username);
    if (index !== -1) {
      users.splice(index, 1);
      setUsers([...users]);
    }
  };

  return (
    <Box style={{ height: '100%' }}>
      <NetworkSelector onSelected={(user) => selected(user)}></NetworkSelector>

      <Box style={{ overflowY: 'auto', minHeight: '100px', marginTop: '36px' }} align="center">
        <AppHeading level="2" style={{ marginBottom: '12px' }}>
          {users.length ? 'Accounts: ' : 'No account added yet'}
        </AppHeading>
        <AccountPlatforms users={users} remove={remove}></AccountPlatforms>
      </Box>
    </Box>
  );
};
