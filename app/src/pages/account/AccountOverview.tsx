import { Anchor, Box, Spinner, Text } from 'grommet'
import { useTranslation } from 'react-i18next'

import { AppAccount, Entity, PAP } from '../../shared/types'
import { AppCard } from '../../ui-components'
import { BoxCentered } from '../../ui-components/BoxCentered'
import { cap } from '../../utils/general'
import { MemberAnchor } from '../vouches/MemberAnchor'
import { AccountPerson } from './AccountPerson'

export const AccountOverview = (props: {
  account?: AppAccount
  pap?: Entity<PAP>
  showAccount?: boolean
}) => {
  const { t } = useTranslation()
  const { account: accountRead, pap: accountPapRead } = props
  const isFounder = accountRead && accountRead.voucher > 10e70

  if (!accountPapRead) {
    return (
      <BoxCentered fill style={{ flexShrink: 0 }}>
        <Spinner></Spinner>
      </BoxCentered>
    )
  }

  return (
    <Box style={{ flexShrink: 0 }}>
      {accountRead && !accountRead.valid ? (
        <AppCard style={{ marginBottom: '36px' }}>
          <Text>
            <b>{t('accountInvalidated')}!</b>
          </Text>
        </AppCard>
      ) : (
        <></>
      )}
      <AccountPerson
        showAccount={props.showAccount}
        pap={accountPapRead.object}
      ></AccountPerson>
      {accountRead ? (
        <Box style={{ marginTop: '8px' }}>
          <Text style={{ fontWeight: 'bold' }}>
            {isFounder ? cap(t('founder')) : cap(t('invitedBy'))}
          </Text>
          {isFounder ? (
            <></>
          ) : (
            <MemberAnchor
              style={{ fontSize: '18px' }}
              tokenId={accountRead?.voucher}
            ></MemberAnchor>
          )}
        </Box>
      ) : (
        <></>
      )}
    </Box>
  )
}
