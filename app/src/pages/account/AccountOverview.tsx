import { Anchor, Box, Spinner, Text } from 'grommet';

import { AccountPerson } from './AccountPerson';
import { AppCard } from '../../ui-components';
import { BoxCentered } from '../../ui-components/BoxCentered';
import { useTranslation } from 'react-i18next';
import { cap } from '../../utils/general';
import { AppAccount, Entity, PAP } from '../../types';
import { MemberAnchor } from '../vouches/MemberAnchor';

export const AccountOverview = (props: { account?: AppAccount; pap?: Entity<PAP> }) => {
  const { t } = useTranslation();
  const { account: accountRead, pap: accountPapRead } = props;
  const isFounder = accountRead && accountRead.voucher > 10e70;

  if (!accountPapRead) {
    return (
      <BoxCentered fill style={{ flexShrink: 0 }}>
        <Spinner></Spinner>
      </BoxCentered>
    );
  }

  return (
    <Box align="center" style={{ flexShrink: 0 }}>
      {accountRead ? (
        !isFounder ? (
          <Box margin={{ bottom: 'large' }}>
            <Text>
              {cap(t('invitedBy'))} <MemberAnchor tokenId={accountRead?.voucher}></MemberAnchor>
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
