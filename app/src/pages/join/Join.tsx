import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Text } from 'grommet';
import { useState } from 'react';
import { isAddress } from 'ethers/lib/utils';
import React from 'react';

import { AppCard, AppHeading } from '../../ui-components';
import { AppConnect } from '../../components/app/AppConnect';
import { useAccountContext } from '../../wallet/AccountContext';
import { useProjectContext } from '../../contexts/ProjectContext';
import { StatementEditable } from '../voice/StatementEditable';
import { SelectedDetailsHelper } from '../../utils/select.details';

import { PAPShare } from './PAPShare';
import { DetailsAndPlatforms, PAP } from '../../types';
import { PAPEntry } from './PAPEntry';
import { DetailsForm } from './DetailsForm';
import { AppBottomButtons } from '../common/BottomButtons';
import { putObject } from '../../utils/store';
import { postApply } from '../../utils/project';
import { BoxCentered } from '../../ui-components/BoxCentered';
import { Loading } from '../common/WaitingTransaction';
import { ViewportHeadingLarge, ViewportPage } from '../../components/app/Viewport';

export interface IJoinProps {
  dum?: any;
}

export const Join = () => {
  const navigate = useNavigate();

  const { project, projectId } = useProjectContext();
  const [pageIx, setPageIx] = useState<number>(0);
  const [sending, setSending] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const invitation = searchParams.get('invitation');

  const { aaAddress: account } = useAccountContext();

  const [personal, setPersonal] = useState<DetailsAndPlatforms>({});

  const [pap, setPap] = useState<PAP>();
  const [cid, setCid] = useState<string>();

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

  const send = async () => {
    if (pap) {
      setSending(true);
      const papEntity = await putObject<PAP>(pap);

      setCid(papEntity.cid);

      if (invitation && projectId) {
        const application = {
          projectId,
          invitationId: invitation,
          papEntity,
        };
        await postApply(application);
      }

      setSending(false);
      nextPage();
    }
  };

  const pages: React.ReactNode[] = [];

  pages.push(
    <ViewportPage key="0">
      <ViewportHeadingLarge label="Join"></ViewportHeadingLarge>
      <Box>
        <Box pad="large">
          <Box margin={{ bottom: 'small' }}>
            <Text>
              This micro(r)evolution is for <b>anyone who</b>:
            </Text>
          </Box>
          <StatementEditable value={project?.whoStatement}></StatementEditable>
        </Box>
        <Box pad="large" style={{ flexShrink: 0 }}>
          <AppHeading level="3" style={{ marginBottom: '16px' }}>
            Select the account
          </AppHeading>
          <AppConnect></AppConnect>
        </Box>
      </Box>
      <AppBottomButtons
        left={{ label: 'home', primary: false, action: () => navigate('..') }}
        right={{ label: 'next', primary: true, action: nextPage }}></AppBottomButtons>
    </ViewportPage>
  );

  if (askPersonal || askPlatform) {
    pages.push(
      <ViewportPage key="3">
        <ViewportHeadingLarge label="Personal"></ViewportHeadingLarge>

        <Box pad="large">
          <DetailsForm selected={project?.selectedDetails} onChange={(d) => setPersonal(d)}></DetailsForm>
        </Box>

        <AppBottomButtons
          popUp={!account ? 'You need to, at least, provide your blockchain account' : undefined}
          left={{ label: 'back', primary: false, action: prevPage }}
          right={{
            label: 'review',
            primary: true,
            action: review,
            disabled: !account,
          }}></AppBottomButtons>
      </ViewportPage>
    );
  }
  pages.push(
    <ViewportPage key="4">
      <ViewportHeadingLarge label="Review"></ViewportHeadingLarge>
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
      <AppBottomButtons
        left={{ label: 'back', primary: false, action: prevPage }}
        right={{ label: 'send', primary: true, action: send }}></AppBottomButtons>
    </ViewportPage>
  );
  pages.push(
    <ViewportPage key="5">
      <ViewportHeadingLarge label="Done!"></ViewportHeadingLarge>

      <Box style={{ flexShrink: 0 }} pad={{ horizontal: 'large' }}>
        <AppCard pad={{ vertical: 'small' }} style={{ flexShrink: 0 }}>
          <Text>
            Your application was received. Wait for it to be accepted by the person who invited you, or share the QR or
            the link below with an existing member and ask them to accept your application.
          </Text>
        </AppCard>

        <PAPShare cid={cid}></PAPShare>
      </Box>
      <AppBottomButtons
        left={{ label: 'back', primary: false, action: prevPage }}
        right={{ label: 'done', primary: true, action: () => navigate('..') }}></AppBottomButtons>
    </ViewportPage>
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
