import { Box, Spinner, Text } from 'grommet'
import { FormPrevious } from 'grommet-icons'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'

import { useAppContainer } from '../../components/app/AppContainer'
import { ViewportPage } from '../../components/app/Viewport'
import { useMember } from '../../contexts/MemberContext'
import { useProjectContext } from '../../contexts/ProjectContext'
import { I18Keys } from '../../i18n/kyel.list'
import { AbsoluteRoutes } from '../../route.names'
import { Entity, PAP } from '../../shared/types'
import { getEntity } from '../../utils/store'
import { AccountPerson } from '../account/AccountPerson'
import { AppBottomButton, AppBottomButtons } from '../common/BottomButtons'
import { VouchMemberWidget } from './VouchMemberWidget'

export const InviteAccountPage = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { hash } = useParams()
  const { setTitle } = useAppContainer()
  const { projectId } = useProjectContext()

  useEffect(() => {
    setTitle({ prefix: t([I18Keys.approveNew]), main: t([I18Keys.member]) })
  }, [i18n.language])

  /** convert hash into pap and send to VouchWidget */
  const [pap, setPap] = useState<Entity<PAP>>()

  useEffect(() => {
    if (hash) {
      getEntity<PAP>(hash).then((pap) => {
        setPap(pap)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash])

  const content = (() => {
    if (!pap)
      return (
        <Box fill align="center" justify="center">
          <Spinner></Spinner>
        </Box>
      )

    return (
      <>
        <Box pad="large" fill>
          <Box>
            <AccountPerson
              pap={pap.object}
              cardStyle={{ marginBottom: '32px' }}
            ></AccountPerson>
            <VouchMemberWidget pap={pap}></VouchMemberWidget>
          </Box>
        </Box>
      </>
    )
  })()

  return (
    <ViewportPage
      content={
        <>
          <Box justify="center" align="center" style={{ flexShrink: '0', height: '50px' }}>
            <Text size="22px" weight="bold">
              {t([I18Keys.appName])}
            </Text>
          </Box>

          {content}
        </>
      }
      nav={
        <AppBottomButton
          onClick={() => navigate(-1)}
          label={t([I18Keys.back])}
          icon={<FormPrevious />}
        ></AppBottomButton>
      }
    ></ViewportPage>
  )
}
