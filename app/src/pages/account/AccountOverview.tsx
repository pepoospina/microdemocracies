import { Anchor, Box, Spinner, Text } from 'grommet';

import { useMemberContext } from '../../contexts/MemberContext';
import { AccountPerson } from './AccountPerson';
import { AppCard } from '../../ui-components';
import { BoxCentered } from '../../ui-components/BoxCentered';
import { useTranslation } from 'react-i18next';

export const AccountOverview = () => {
  const { t } = useTranslation();
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
              {t('invitedBy')}{' '}
              <Anchor>
                {t('member')} #{accountRead?.voucher}
              </Anchor>
            </Text>
          </Box>
        ) : (
          <Box>{t('founder')}</Box>
        )
      ) : (
        <></>
      )}
      {accountRead && !accountRead.valid ? (
        <AppCard style={{ marginBottom: '36px' }}>
          <Text>
            <b>{t('accountInvalidated')}!</b>
          </Text>
        </AppCard>
      ) : (
        <></>
      )}
      <AccountPerson pap={accountPapRead.object}></AccountPerson>
    </Box>
  );
};
