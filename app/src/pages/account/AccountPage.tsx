import { Box } from 'grommet'
import { FormPrevious } from 'grommet-icons'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { useAppContainer } from '../../components/app/AppContainer'
import { ViewportPage } from '../../components/app/Viewport'
import { useMember } from '../../contexts/MemberContext'
import { useProjectContext } from '../../contexts/ProjectContext'
import { AbsoluteRoutes } from '../../route.names'
import { cap } from '../../utils/general'
import { AccountChallenge } from '../challenges/AccountChallenge'
import { AppBottomButton } from '../common/BottomButtons'
import { AccountOverview } from './AccountOverview'

export const AccountPage = () => {
  const { t, i18n } = useTranslation()
  const { tokenId } = useParams()
  const navigate = useNavigate()
  const { account: accountRead, accountPap: accountPapRead } = useMember({
    tokenId: tokenId ? +tokenId : undefined,
  })
  const { setTitle } = useAppContainer()
  const { projectId } = useProjectContext()

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
          label={t('projectMembers')}
          onClick={() =>
            navigate(AbsoluteRoutes.ProjectMembers((projectId as number).toString()))
          }
        ></AppBottomButton>
      }
    ></ViewportPage>
  )
}
