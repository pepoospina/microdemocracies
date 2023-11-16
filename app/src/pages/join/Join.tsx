import { useNavigate } from 'react-router-dom';
import { Box, Text } from 'grommet';
import { useState } from 'react';
import { isAddress } from 'ethers/lib/utils';
import React from 'react';

import { AppHeading } from '../../ui-components';
import { AppScreen, BottomButtons } from '../../ui-components/AppFormScreen';
import { AppConnect } from '../../components/app/AppConnect';
import { RouteNames } from '../../App';
import { useAccountContext } from '../../wallet/AccountContext';
import { useProjectContext } from '../../contexts/ProjectContext';
import { StatementEditable } from '../voice/StatementEditable';
import { SelectedDetailsHelper } from '../../utils/select.details';

import { PAPShare } from './PAPShare';
import { DetailsAndPlatforms, PAP } from '../../types';
import { PAPEntry } from './PAPEntry';
import { DetailsForm } from './DetailsForm';

export interface IJoinProps {
  dum?: any;
}

export const Join = () => {
  const navigate = useNavigate();

  const { goHome, project } = useProjectContext();
  const [pageIx, setPageIx] = useState<number>(0);

  const { aaAddress: account } = useAccountContext();

  const [personal, setPersonal] = useState<DetailsAndPlatforms>({});

  const [pap, setPap] = useState<PAP>();

  const askPlatform = SelectedDetailsHelper.hasPlatforms(project?.selectedDetails);
  const askPersonal = SelectedDetailsHelper.hasPersonal(project?.selectedDetails);

  const review = async () => {
    if (account === undefined || !isAddress(account)) {
      throw new Error('Account not defined');
    }

    setPap({
      person: personal,
      account,
    });

    nextPage();
  };

  const nextPage = () => {
    if (pageIx + 1 < pages.length) {
      setPageIx(pageIx + 1);
    }
  };

  const prevPage = () => {
    if (pageIx - 1 >= 0) {
      setPageIx(pageIx - 1);
    }
  };

  const pages: React.ReactNode[] = [];

  pages.push(
    <AppScreen key="0" label="Let's start!">
      <Box>
        <Box pad="large">
          <Box>
            <Text>You are about to join a micro(r)evolution addressed to anyone who:</Text>
          </Box>
          <StatementEditable value={project?.whoStatement}></StatementEditable>
        </Box>
        <Box pad="large" style={{ flexShrink: 0 }}>
          <AppHeading level="2" style={{ marginBottom: '16px' }}>
            Select the account
          </AppHeading>
          <AppConnect></AppConnect>
        </Box>
      </Box>
      <BottomButtons
        left={{ label: 'home', primary: false, action: () => goHome() }}
        right={{ label: 'next', primary: true, action: nextPage }}></BottomButtons>
    </AppScreen>
  );

  if (askPersonal || askPlatform) {
    pages.push(
      <AppScreen key="3" label="Personal">
        <Box>
          <Box pad="large">
            <DetailsForm selected={project?.selectedDetails} onChange={(d) => setPersonal(d)}></DetailsForm>
          </Box>
        </Box>
        <BottomButtons
          popUp={!account ? 'You need to, at least, provide your blockchain account' : undefined}
          left={{ label: 'back', primary: false, action: prevPage }}
          right={{
            label: 'review',
            primary: true,
            action: review,
            disabled: !account,
          }}></BottomButtons>
      </AppScreen>
    );
  }
  pages.push(
    <AppScreen key="4" label="Review">
      <Box style={{ width: '100%' }}>
        <PAPEntry pap={pap}></PAPEntry>
      </Box>
      <BottomButtons
        left={{ label: 'back', primary: false, action: prevPage }}
        right={{ label: 'share', primary: true, action: nextPage }}></BottomButtons>
    </AppScreen>
  );
  pages.push(
    <AppScreen key="5" label="Scan to vouch">
      <Box fill>
        <PAPShare pap={pap}></PAPShare>
      </Box>
      <BottomButtons
        left={{ label: 'back', primary: false, action: prevPage }}
        right={{ label: 'done', primary: true, action: () => navigate(RouteNames.Base) }}></BottomButtons>
    </AppScreen>
  );

  return (
    <Box justify="start" align="center" style={{ height: '100vh', width: '100%' }}>
      {pages.map((page, ix) => {
        return (
          <div key={ix} style={{ height: '100%', width: '100%', display: pageIx === ix ? 'block' : 'none' }}>
            {page}
          </div>
        );
      })}
    </Box>
  );
};
