import { useNavigate } from 'react-router-dom';
import { Box, Spinner, Text } from 'grommet';
import { FormNext, FormPrevious } from 'grommet-icons';
import { ReactNode, useEffect, useState } from 'react';

import { StatementEditable } from '../voice/StatementEditable';
import { AppHeading } from '../../ui-components';
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

const NPAGES = 4;

export const CreateProject = () => {
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

  const boxStyle: React.CSSProperties = {};

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
    if (pageIx === 0) return 'back';
    return 'prev';
  })();

  const nextStr = (() => {
    if (pageIx === 1) return 'next';
    if (pageIx === 2) return 'review';
    if (pageIx === 3) return 'create';
    return 'next';
  })();

  const nextDisabled = (() => {
    if (pageIx === 2 && !founderPap) return true;
    if (pageIx === 3 && !whoStatement) return true;
    return false;
  })();

  if (isCreating) {
    return (
      <BoxCentered fill>
        <Text>Creating your micro(r)evolution</Text>
        <Spinner></Spinner>
      </BoxCentered>
    );
  }

  const pages: ReactNode[] = [
    <Box style={boxStyle}>
      <Box style={{ width: '100%', flexShrink: 0 }} pad="large">
        <Box style={{ marginBottom: '12px', fontSize: '10px', fontWeight: '300', flexShrink: 0 }}>
          <AppHeading level="3">This micro(r)revolution is for anyone who:</AppHeading>
          <Text style={{ margin: '12px 0px 0px 0px' }}>
            <Bold>Examples are:</Bold> "LIVES IN...", "STUDIES AT...", "WANTS TO...", etc.
          </Text>
        </Box>
        <Box>
          <StatementEditable
            onChanged={(value) => {
              if (value) setWhoStatement(value);
            }}
            editable
            placeholder="WANTS TO..."></StatementEditable>
        </Box>
      </Box>

      <Box style={{ width: '100%', flexShrink: 0, overflowY: 'auto' }} pad="large">
        <DetailsSelector onChanged={(details) => setDetails(details)}></DetailsSelector>
      </Box>
    </Box>,

    <Box style={boxStyle}>
      <Box style={{ width: '100%', flexShrink: 0 }} pad="large">
        <Box style={{ marginBottom: '24px' }}>
          <AppHeading level="3">Your details:</AppHeading>
        </Box>
        <DetailsForm selected={selectedDetails} onChange={(details) => setFounderDetails(details)}></DetailsForm>
      </Box>
    </Box>,

    <Box style={boxStyle}>
      <Box style={{ width: '100%', flexShrink: 0 }} pad="large">
        <AppHeading level="3">Connect Account:</AppHeading>
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
      <ViewportHeadingLarge label="Start a micro(r)evolution"></ViewportHeadingLarge>

      <Box>
        {' '}
        {pages.map((page, ix) => {
          return (
            <div key={ix} style={{ height: '100%', width: '100%', display: pageIx === ix ? 'block' : 'none' }}>
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
        }}></AppBottomButtons>
    </ViewportPage>
  );
};
