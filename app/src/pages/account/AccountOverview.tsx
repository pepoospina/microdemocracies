import { Box, Spinner } from 'grommet';

import { useTokenAccount } from '../../contexts/AccountContext';
import { AccountPerson } from './AccountPerson';
import { AppCard } from '../../ui-components';
import { COMMUNITY_MEMBER } from '../../config/community';
import { BoxCentered } from '../../ui-components/BoxCentered';

export const AccountOverview = () => {
  const { accountPapRead, accountRead } = useTokenAccount();

  const isFounder = accountRead && accountRead.voucher > 10e70;

  return accountPapRead ? (
    <Box align="center">
      {accountRead ? (
        !isFounder ? (
          <Box margin={{ bottom: 'large' }}>
            Vouched by {COMMUNITY_MEMBER} #{accountRead?.voucher}
          </Box>
        ) : (
          <Box>Founder</Box>
        )
      ) : (
        <></>
      )}
      {accountRead && !accountRead.valid ? (
        <AppCard style={{ marginBottom: '36px' }}>
          <b>Account invalidated!</b>
        </AppCard>
      ) : (
        <></>
      )}
      <AccountPerson pap={accountPapRead.object}></AccountPerson>
    </Box>
  ) : (
    <BoxCentered fill>
      <Spinner></Spinner>
    </BoxCentered>
  );
};
