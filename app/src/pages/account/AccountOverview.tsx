import { Anchor, Box, Spinner, Text } from 'grommet';

import { useMemberContext } from '../../contexts/MemberContext';
import { AccountPerson } from './AccountPerson';
import { AppCard } from '../../ui-components';
import { COMMUNITY_MEMBER } from '../../config/community';
import { BoxCentered } from '../../ui-components/BoxCentered';

export const AccountOverview = () => {
  const { accountPapRead, accountRead } = useMemberContext();
  const isFounder = accountRead && accountRead.voucher > 10e70;

  if (!accountPapRead) {
    return (
      <BoxCentered fill>
        <Spinner></Spinner>
      </BoxCentered>
    );
  }

  return (
    <Box align="center">
      {accountRead ? (
        !isFounder ? (
          <Box margin={{ bottom: 'large' }}>
            <Text>
              Invited by{' '}
              <Anchor>
                {COMMUNITY_MEMBER} #{accountRead?.voucher}
              </Anchor>
            </Text>
          </Box>
        ) : (
          <Box>Founder</Box>
        )
      ) : (
        <></>
      )}
      {accountRead && !accountRead.valid ? (
        <AppCard style={{ marginBottom: '36px' }}>
          <Text>
            <b>Account invalidated!</b>
          </Text>
        </AppCard>
      ) : (
        <></>
      )}
      <AccountPerson pap={accountPapRead.object}></AccountPerson>
    </Box>
  );
};
