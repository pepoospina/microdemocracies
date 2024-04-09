import { useEffect } from 'react'

import { useNavigate, useParams } from 'react-router-dom'

import { Box } from 'grommet'
import { FormPrevious } from 'grommet-icons'

import { useAppContainer } from '../../components/app/AppContainer'
import { ViewportPage } from '../../components/app/Viewport'
import { useMember } from '../../contexts/MemberContext'
import { cap } from '../../utils/general'
import { AccountChallenge } from '../challenges/AccountChallenge'
import { AppBottomButton } from '../common/BottomButtons'
import { AccountOverview } from './AccountOverview'

import { useTranslation } from 'react-i18next'

export const AccountPage = () => {
  const { t, i18n } = useTranslation()
  const { tokenId } = useParams()
  const navigate = useNavigate()
  const { account: accountRead, accountPap: accountPapRead } = useMember({
    tokenId: tokenId ? +tokenId : undefined,
  })
  const { setTitle } = useAppContainer()

  useEffect(() => {
    setTitle({ prefix: t('project'), main: cap(t('member')) })
  }, [i18n.language])

  if (!tokenId) {
    throw new Error('tokenId undefined')
  }

  return (
    <ViewportPage
      content={
        <Box pad="large" style={{ flexShrink: 0 }}>
          <AccountOverview
            showAccount
            account={accountRead}
            pap={accountPapRead}
          ></AccountOverview>
          <AccountChallenge
            account={accountRead}
            cardStyle={{ marginTop: '36px', marginBottom: '36px' }}
          />
        </Box>
      }
      nav={
        <AppBottomButton
          icon={<FormPrevious />}
          label="back"
          onClick={() => navigate(-1)}
        ></AppBottomButton>
      }
    ></ViewportPage>
  )
}
