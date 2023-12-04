import { useNavigate } from 'react-router-dom';
import { Box, Spinner, Text } from 'grommet';
import { FormNext, FormPrevious } from 'grommet-icons';
import { ReactNode, useEffect, useState } from 'react';

import { StatementEditable } from '../voice/StatementEditable';
import { AppCard, AppHeading } from '../../ui-components';
import { DetailsSelector } from './DetailsSelector';
import { DetailsForm } from '../join/DetailsForm';

import { AppConnect } from '../../components/app/AppConnect';
import { ProjectSummary } from './ProjectSummary';
import { BoxCentered } from '../../ui-components/BoxCentered';

import { ViewportHeadingLarge, ViewportPage } from '../../components/app/Viewport';
import { Bold } from '../landing/LandingPage';
import { AppBottomButtons } from '../common/BottomButtons';
import { useCreateProject } from './useCreateProject';
import { RouteNames } from '../../App';
import { Trans, useTranslation } from 'react-i18next';

const NPAGES = 5;

export const CreateProject = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [pageIx, setPageIx] = useState(0);

  const {
    founderPap,
    whoStatement,
    selectedDetails,
    isCreating,
    isSuccess,
    projectId,
    setFounderDetails,
    setWhoStatement,
    setDetails,
    createProject,
  } = useCreateProject();

  useEffect(() => {
    if (isSuccess && projectId) {
      navigate(RouteNames.ProjectHome(projectId.toString()));
    }
  }, [isSuccess, navigate, projectId]);

  const boxStyle: React.CSSProperties = {
    flexGrow: '1',
    justifyContent: 'center',
  };

  const headingStyle: React.CSSProperties = {
    marginBottom: '4vw',
  };

  const nextPage = () => {
    if (pageIx < NPAGES - 1) {
      setPageIx(pageIx + 1);
    }

    if (pageIx === NPAGES - 1) {
      createProject();
    }
  };

  const prevPage = () => {
    if (pageIx === 0) {
      navigate(-1);
    }
    if (pageIx > 0) {
      setPageIx(pageIx - 1);
    }
  };

  const prevStr = (() => {
    if (pageIx === 0) return t('back');
    return t('prev');
  })();

  const nextStr = (() => {
    if (pageIx === 1) return t('next');
    if (pageIx === 2) return t('next');
    if (pageIx === 3) return t('review');
    if (pageIx === 4) return t('create');
    return t('next');
  })();

  const nextPrimary = (() => {
    if (pageIx === 4) return true;
    return false;
  })();

  const nextDisabled = (() => {
    if (pageIx === 3 && !founderPap) return true;
    if (pageIx === 4 && !whoStatement) return true;
    return false;
  })();

  if (isCreating) {
    return (
      <BoxCentered fill>
        <Text>{t('creatingProject')}</Text>
        <Spinner></Spinner>
      </BoxCentered>
    );
  }

  const pages: ReactNode[] = [
    <Box style={boxStyle} pad="large">
      <Box style={{ marginBottom: '12px', fontSize: '10px', fontWeight: '300', flexShrink: 0 }}>
        <AppHeading style={headingStyle} level="3">
          {t('whoTitle')}:
        </AppHeading>
        <Text style={{ margin: '12px 0px 0px 0px' }}>
          <Trans i18nKey="examplesWho" components={{ Bold: <Bold></Bold> }}></Trans>
        </Text>
      </Box>
      <Box>
        <StatementEditable
          onChanged={(value) => {
            if (value) setWhoStatement(value);
          }}
          editable
          placeholder={`${t('wantsTo')}...`}></StatementEditable>
      </Box>
    </Box>,

    <Box style={boxStyle} pad="large">
      <AppHeading style={headingStyle} level="3">
        {t('toJoinMsg')}:
      </AppHeading>
      <DetailsSelector onChanged={(details) => setDetails(details)}></DetailsSelector>
    </Box>,

    <Box style={boxStyle}>
      <Box style={{ width: '100%', flexShrink: 0 }} pad="large">
        <AppHeading style={headingStyle} level="3">
          {t('yourDetails')}:
        </AppHeading>

        <DetailsForm selected={selectedDetails} onChange={(details) => setFounderDetails(details)}></DetailsForm>
      </Box>
    </Box>,

    <Box style={boxStyle}>
      <Box style={{ width: '100%', flexShrink: 0 }} pad="large">
        <AppHeading style={headingStyle} level="3">
          {t('connectAccount')}:
        </AppHeading>
        <Box pad="large" style={{ flexShrink: 0 }}>
          <AppConnect></AppConnect>
        </Box>
      </Box>
    </Box>,

    <Box style={boxStyle}>
      <ProjectSummary
        selectedDetails={selectedDetails}
        whatStatement={''}
        whoStatement={whoStatement}
        founderPap={founderPap}></ProjectSummary>
    </Box>,
  ];

  return (
    <ViewportPage>
      <ViewportHeadingLarge label={t('startProject')}></ViewportHeadingLarge>

      <Box style={{ flexGrow: '1' }} justify="center">
        {/* {pageIx === 0 ? (
          <Box pad={{ horizontal: 'large' }} style={{ flexShrink: 0 }}>
            <AppCard>
              <Text>
                <Trans i18nKey={'tryoutMsg'} components={{ Bold: <Bold></Bold> }}></Trans>
              </Text>
            </AppCard>
          </Box>
        ) : (
          <></>
        )} */}

        {pages.map((page, ix) => {
          return (
            <div key={ix} style={{ width: '100%', display: pageIx === ix ? 'block' : 'none' }}>
              {page}
            </div>
          );
        })}
      </Box>

      <AppBottomButtons
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
        }}></AppBottomButtons>
    </ViewportPage>
  );
};
