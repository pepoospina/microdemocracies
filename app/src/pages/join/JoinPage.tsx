import { isAddress } from 'ethers/lib/utils'
import { Box, Text } from 'grommet'
import { FormPrevious } from 'grommet-icons'
import { useEffect, useState } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { AppConnectWidget } from '../../components/app/AppConnectButton'
import { useAppContainer } from '../../components/app/AppContainer'
import { ViewportPage } from '../../components/app/Viewport'
import { useProjectContext } from '../../contexts/ProjectContext'
import { I18Keys } from '../../i18n/kyel.list'
import { AbsoluteRoutes } from '../../route.names'
import { DetailsAndPlatforms, PAP } from '../../shared/types'
import { AppCard } from '../../ui-components'
import { BoxCentered } from '../../ui-components/BoxCentered'
import { postApply } from '../../utils/project'
import { SelectedDetailsHelper } from '../../utils/select.details'
import { putObject } from '../../utils/store'
import { useAccountContext } from '../../wallet/AccountContext'
import { AppBottomButton, AppBottomButtons } from '../common/BottomButtons'
import { Loading } from '../common/Loading'
import { StatementEditable } from '../voice/StatementEditable'
import { DetailsForm } from './DetailsForm'
import { PAPEntry } from './PAPEntry'
import { PAPShare } from './PAPShare'

export interface IJoinProps {
  dum?: any
}

export const JoinPage = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const { project, projectId } = useProjectContext()
  const [pageIx, setPageIx] = useState<number>(0)
  const [sending, setSending] = useState<boolean>(false)
  const [searchParams] = useSearchParams()
  const invitation = searchParams.get('invitation')

  const { aaAddress: account } = useAccountContext()

  const [personal, setPersonal] = useState<DetailsAndPlatforms>({})

  const [pap, setPap] = useState<PAP>()
  const [cid, setCid] = useState<string>()

  const askPlatform = SelectedDetailsHelper.hasPlatforms(project?.selectedDetails)
  const askPersonal = SelectedDetailsHelper.hasPersonal(project?.selectedDetails)

  const { setTitle } = useAppContainer()

  useEffect(() => {
    switch (pageIx) {
      case 0:
        setTitle({ prefix: t([I18Keys.joinA]), main: t([I18Keys.project]) })
        break

      case 1:
        setTitle({
          prefix: t([I18Keys.personalDetailsPre]),
          main: t([I18Keys.personalDetailsMain]),
        })
        break

      case 2:
        setTitle({
          prefix: t([I18Keys.reviewApplicationPre]),
          main: t([I18Keys.reviewApplicationMain]),
        })
        break

      case 3:
        setTitle({
          prefix: t([I18Keys.applicationSentPre]),
          main: t([I18Keys.applicationSentMain]),
        })
        break
    }
  }, [pageIx, i18n.language])

  const review = async () => {
    if (account === undefined || !isAddress(account)) {
      throw new Error('Account not defined')
    }

    setPap({
      person: personal,
      account,
    })

    nextPage()
  }

  const haveDetails = askPersonal || askPlatform

  const nextPage = () => {
    if (pageIx + 1 < pages.length) {
      if (pageIx === 0 && !haveDetails) {
        setPageIx(pageIx + 2)
      }
      setPageIx(pageIx + 1)
    }
  }

  const prevPage = () => {
    if (pageIx - 1 >= 0) {
      if (pageIx === 2 && !haveDetails) {
        setPageIx(pageIx - 2)
      }
      setPageIx(pageIx - 1)
    }
  }

  const send = async () => {
    if (pap) {
      setSending(true)
      const papEntity = await putObject<PAP>(pap)

      setCid(papEntity.cid)

      if (projectId) {
        const application = {
          projectId,
          invitationId: invitation !== null ? invitation : undefined,
          papEntity,
        }
        await postApply(application)
      }

      setSending(false)
      nextPage()
    }
  }

  const pages: React.ReactNode[] = [
    <ViewportPage
      key="0"
      content={
        <Box>
          <Box pad="large">
            <Box margin={{ bottom: 'small' }}>
              <Text>{t([I18Keys.whoTitle])}:</Text>
            </Box>
            <StatementEditable value={project?.whoStatement}></StatementEditable>
          </Box>
          <Box pad="large" style={{ flexShrink: 0 }} align="center">
            <AppConnectWidget></AppConnectWidget>
          </Box>
        </Box>
      }
      nav={
        <AppBottomButtons
          left={{
            label: t([I18Keys.exit]),
            primary: false,
            action: () =>
              navigate(AbsoluteRoutes.ProjectHome(projectId?.toString() as string)),
          }}
          right={{
            label: t([I18Keys.next]),
            primary: true,
            action: nextPage,
          }}
        ></AppBottomButtons>
      }
    ></ViewportPage>,

    <ViewportPage
      key="3"
      content={
        <Box pad="large">
          <DetailsForm
            selected={project?.selectedDetails}
            onChange={(d) => setPersonal(d)}
          ></DetailsForm>
        </Box>
      }
      nav={
        <AppBottomButtons
          popUp={!account ? 'You need to connect to join' : undefined}
          left={{ label: t(I18Keys.back), primary: false, action: prevPage }}
          right={{
            label: t(I18Keys.review),
            primary: true,
            action: review,
            disabled: !account,
          }}
        ></AppBottomButtons>
      }
    ></ViewportPage>,
    <ViewportPage
      key="4"
      content={
        <Box>
          <Box style={{ flexShrink: 0 }}>
            <PAPEntry pap={pap}></PAPEntry>
          </Box>
          {sending ? (
            <BoxCentered fill>
              <Loading label="Sending your application"></Loading>
            </BoxCentered>
          ) : (
            <></>
          )}
        </Box>
      }
      nav={
        <AppBottomButtons
          left={{ label: t([I18Keys.back]), primary: false, action: prevPage }}
          right={{
            label: t([I18Keys.send]),
            primary: true,
            action: send,
          }}
        ></AppBottomButtons>
      }
    ></ViewportPage>,
    <ViewportPage
      key="5"
      content={
        <Box style={{ flexShrink: 0 }} pad={{ horizontal: 'large' }}>
          <AppCard pad={{ vertical: 'small' }} style={{ flexShrink: 0 }}>
            <Text>{t([I18Keys.applicationReceived])}</Text>
          </AppCard>

          <PAPShare cid={cid}></PAPShare>
        </Box>
      }
      nav={
        <AppBottomButton
          label={t([I18Keys.done])}
          icon={<FormPrevious></FormPrevious>}
          onClick={() =>
            navigate(AbsoluteRoutes.ProjectHome(projectId?.toString() as string))
          }
        ></AppBottomButton>
      }
    ></ViewportPage>,
  ]

  return (
    <Box justify="start" align="center" style={{ height: '100vh', width: '100%' }}>
      {pages.map((page, ix) => {
        return (
          <div
            key={ix}
            style={{
              height: '100%',
              width: '100%',
              display: pageIx === ix ? 'block' : 'none',
            }}
          >
            {page}
          </div>
        )
      })}
    </Box>
  )
}
