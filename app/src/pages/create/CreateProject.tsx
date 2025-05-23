import { Box, Spinner, Text } from 'grommet'
import { FormNext, FormPrevious } from 'grommet-icons'
import { ReactNode, useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { AppConnectWidget } from '../../components/app/AppConnectButton'
import { useAppContainer } from '../../components/app/AppContainer'
import { ViewportPage } from '../../components/app/Viewport'
import { useLoadingContext } from '../../contexts/LoadingContext'
import { useToast } from '../../contexts/ToastsContext'
import { I18Keys } from '../../i18n/kyel.list'
import { AbsoluteRoutes } from '../../route.names'
import { AppCard, AppHeading } from '../../ui-components'
import { Bold } from '../../ui-components/Bold'
import { BoxCentered } from '../../ui-components/BoxCentered'
import { useAccountContext } from '../../wallet/AccountContext'
import { AppBottomButtons } from '../common/BottomButtons'
import { DetailsForm } from '../join/DetailsForm'
import { StatementEditable } from '../voice/StatementEditable'
import { DetailsSelector } from './DetailsSelector'
import { ProjectSummary } from './ProjectSummary'
import { useCreateProject } from './useCreateProject'

const NPAGES = 5

export const CreateProject = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [pageIx, setPageIx] = useState(0)
  const { setTitle } = useAppContainer()
  const { aaAddress } = useAccountContext()

  const {
    founderPap,
    whoStatement,
    selectedDetails,
    isCreating,
    isError,
    error,
    projectId,
    setFounderDetails,
    setWhoStatement,
    setDetails,
    createProject,
  } = useCreateProject()

  const {
    setLoading,
    setTitle: setTitleToLoading,
    setSubtitle,
    setExpectedLoadingTime,
  } = useLoadingContext()

  const { show } = useToast()

  useEffect(() => {
    if (projectId) {
      navigate(AbsoluteRoutes.ProjectHome(projectId.toString()))
    }
  }, [navigate, projectId])

  useEffect(() => {
    setTitle({ prefix: t([I18Keys.startA]), main: t([I18Keys.project]) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTitle, i18n.language])

  useEffect(() => {
    if (error) {
      show({
        title: t([I18Keys.errorCreatingProject]),
        message: error.message,
        status: 'critical',
      })
    }
  }, [error])

  const boxStyle: React.CSSProperties = {
    flexGrow: '1',
    justifyContent: 'center',
  }

  const nextPage = () => {
    if (pageIx < NPAGES - 1) {
      if (pageIx === 2 && aaAddress) {
        setPageIx(pageIx + 2)
      } else {
        setPageIx(pageIx + 1)
      }
    }

    if (pageIx === NPAGES - 1) {
      /** Loading modal shown */
      setLoading(true)
      setTitleToLoading(t([I18Keys.creatingProject]))
      setSubtitle(t([I18Keys.preparingData]))
      setExpectedLoadingTime(17000)
      createProject()
    }
  }

  const prevPage = () => {
    if (pageIx === 0) {
      navigate(-1)
    }
    if (pageIx > 0) {
      if (pageIx === 4 && aaAddress) {
        setPageIx(pageIx - 2)
      } else {
        setPageIx(pageIx - 1)
      }
    }
  }

  const prevStr = (() => {
    if (pageIx === 0) return t([I18Keys.back])
    return t([I18Keys.prev])
  })()

  const nextStr = (() => {
    if (pageIx === 1) return t([I18Keys.next])
    if (pageIx === 2) {
      if (aaAddress) {
        return t([I18Keys.review])
      } else {
        return t([I18Keys.next])
      }
    }
    if (pageIx === 3) return t([I18Keys.review])
    if (pageIx === 4) return t([I18Keys.create])
    return t([I18Keys.next])
  })()

  const nextPrimary = (() => {
    if (pageIx === 4) return true
    return false
  })()

  const nextDisabled = (() => {
    if (pageIx === 2 && aaAddress && !founderPap) return true
    if (pageIx === 3 && !founderPap) return true
    if (pageIx === 4 && !whoStatement) return true
    return false
  })()

  if (isCreating) {
    return (
      <BoxCentered fill>
        <Text>{t([I18Keys.creatingProject])}</Text>
        <Spinner></Spinner>
      </BoxCentered>
    )
  }

  const pages: ReactNode[] = [
    <Box style={boxStyle} pad="large">
      <Box pad={{ vertical: 'large' }} style={{ flexShrink: 0 }}>
        <AppCard>
          <Text>
            <Trans i18nKey={I18Keys.tryoutMsg} components={{ Bold: <Bold></Bold> }}></Trans>
          </Text>
        </AppCard>
      </Box>
      <AppHeading level="3" style={{ marginBottom: '24px' }}>
        {t([I18Keys.whoTitle])}
      </AppHeading>
      <Box>
        <StatementEditable
          onChanged={(value) => {
            if (value) setWhoStatement(value)
          }}
          editable
          placeholder={`${t([I18Keys.wantsTo])}...`}
        ></StatementEditable>
      </Box>
      <Text style={{ margin: '12px 0px 0px 0px' }}>
        <Trans i18nKey={I18Keys.examplesWho} components={{ Bold: <Bold></Bold> }}></Trans>
      </Text>
    </Box>,

    <Box style={boxStyle} pad="large">
      <AppHeading level="3" style={{ marginBottom: '18px' }}>
        {t([I18Keys.toJoinMsg])}
      </AppHeading>
      <DetailsSelector onChanged={(details) => setDetails(details)}></DetailsSelector>
    </Box>,

    <Box style={boxStyle} pad="large">
      <AppHeading level="3" style={{ marginBottom: '18px' }}>
        {t([I18Keys.yourDetails])}
      </AppHeading>
      <DetailsForm
        selected={selectedDetails}
        onChange={(details) => setFounderDetails(details)}
      ></DetailsForm>
    </Box>,

    <Box style={{ ...boxStyle, paddingTop: '80px' }} pad="large" align="center">
      <AppConnectWidget></AppConnectWidget>
    </Box>,

    <Box style={boxStyle} pad="large">
      <AppHeading level="3" style={{ marginBottom: '18px' }}>
        {t([I18Keys.projectSummary])}
      </AppHeading>
      <ProjectSummary
        selectedDetails={selectedDetails}
        whatStatement={''}
        whoStatement={whoStatement}
        founderPap={founderPap}
      ></ProjectSummary>
    </Box>,
  ]

  return (
    <ViewportPage
      content={
        <Box style={{ flexGrow: '1' }} justify="center">
          {pages.map((page, ix) => {
            return (
              <div
                key={ix}
                style={{
                  width: '100%',
                  display: pageIx === ix ? 'block' : 'none',
                }}
              >
                {page}
              </div>
            )
          })}
        </Box>
      }
      nav={
        <AppBottomButtons
          popUp={isError ? error?.message : undefined}
          left={{
            action: () => prevPage(),
            icon: <FormPrevious></FormPrevious>,
            label: prevStr,
          }}
          right={{
            action: () => nextPage(),
            icon: <FormNext></FormNext>,
            label: nextStr,
            disabled: nextDisabled,
            primary: nextPrimary,
          }}
        ></AppBottomButtons>
      }
    ></ViewportPage>
  )
}
