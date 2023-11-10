import { useNavigate } from 'react-router-dom';
import { Box, Text } from 'grommet';
import { useState } from 'react';
import { isAddress } from 'ethers/lib/utils';

import React from 'react';

import { AppHeading, AppCard } from '../../ui-components';
import { AppPlatformsSelector } from './PlatformsSelector';
import { PAPShare } from './PAPShare';
import { PAP, PersonDetails, PlatformAccount } from '../../types';
import { PAPEntry } from './PAPEntry';

import { AppScreen, BottomButtons } from '../../ui-components/AppFormScreen';
import { Intro } from './Intro';
import { AppPersonalDetails } from './PersonalDetails';
import { AppConnect } from '../../components/app/AppConnect';
import { RouteNames } from '../../App';
import { useAccountContext } from '../../wallet/AccountContext';

export interface IJoinProps {
  dum?: any;
}

export const Join = () => {
  const navigate = useNavigate();

  const [pageIx, setPageIx] = useState<number>(0);

  const { aaAddress: account } = useAccountContext();

  const [platforms, setPlatforms] = useState<PlatformAccount[]>([]);
  const [personal, setPersonal] = useState<PersonDetails>({});

  const [pap, setPap] = useState<PAP>();

  const review = async () => {
    if (account === undefined || !isAddress(account)) {
      throw new Error('Account not defined');
    }

    setPap({
      person: {
        personal,
        platforms,
      },
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

  const pages: React.ReactNode[] = [
    <AppScreen key="0" label="Let's start!">
      <Box>
        <Intro style={{ flexShrink: 0 }}></Intro>
        <Box pad="large" style={{ flexShrink: 0 }}>
          <AppHeading level="2" style={{ marginBottom: '16px' }}>
            Select the account
          </AppHeading>
          <AppConnect></AppConnect>
        </Box>
      </Box>
      <BottomButtons
        left={{ label: 'home', primary: false, action: () => navigate(RouteNames.Base) }}
        right={{ label: 'next', primary: true, action: nextPage }}></BottomButtons>
    </AppScreen>,

    <AppScreen key="1" label="Existing Platforms">
      <Box>
        <Box pad="large" style={{ flexShrink: 0 }}>
          <AppCard margin={{ bottom: 'medium' }}>
            <Text>Provide your username on existing platforms.</Text>
          </AppCard>
        </Box>
        <Box pad="large" style={{ flexGrow: 1, flexShrink: 0 }}>
          <AppPlatformsSelector onChange={(p) => setPlatforms(p)}></AppPlatformsSelector>
        </Box>
      </Box>
      <BottomButtons
        left={{ label: 'back', primary: false, action: prevPage }}
        right={{ label: 'next', primary: true, action: nextPage }}></BottomButtons>
    </AppScreen>,

    <AppScreen key="3" label="Personal">
      <Box>
        <Box style={{ flexShrink: 0 }}>
          <AppPersonalDetails onChange={(d) => setPersonal(d)}></AppPersonalDetails>
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
    </AppScreen>,

    <AppScreen key="4" label="Review">
      <Box style={{ width: '100%' }}>
        <PAPEntry pap={pap}></PAPEntry>
      </Box>
      <BottomButtons
        left={{ label: 'back', primary: false, action: prevPage }}
        right={{ label: 'share', primary: true, action: nextPage }}></BottomButtons>
    </AppScreen>,

    <AppScreen key="5" label="Scan to vouch">
      <Box fill>
        <PAPShare pap={pap}></PAPShare>
      </Box>
      <BottomButtons
        left={{ label: 'back', primary: false, action: prevPage }}
        right={{ label: 'done', primary: true, action: () => navigate(RouteNames.Base) }}></BottomButtons>
    </AppScreen>,
  ];

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
