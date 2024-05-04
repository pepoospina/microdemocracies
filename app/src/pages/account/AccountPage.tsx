import { Box } from 'grommet'
import { FormPrevious } from 'grommet-icons'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { useAppContainer } from '../../components/app/AppContainer'
import { ViewportPage } from '../../components/app/Viewport'
import { useMember } from '../../contexts/MemberContext'
import { useProjectContext } from '../../contexts/ProjectContext'
import { I18Keys } from '../../i18n/kyel.list'
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
    setTitle({ prefix: t([I18Keys.project]), main: cap(t([I18Keys.member])) })
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
          label={t([I18Keys.projectMembers])}
          onClick={() =>
            navigate(AbsoluteRoutes.ProjectMembers((projectId as number).toString()))
          }
        ></AppBottomButton>
      }
    ></ViewportPage>
  )
}
