import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Text } from 'grommet';
import { useEffect, useState } from 'react';
import { isAddress } from 'ethers/lib/utils';
import React from 'react';

import { AppCard, AppHeading } from '../../ui-components';
import { AppConnectButton } from '../../components/app/AppConnectButton';
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
import { Loading } from '../common/Loading';
import { ViewportPage } from '../../components/app/Viewport';
import { useAppContainer } from '../../components/app/AppContainer';
import { useTranslation } from 'react-i18next';

export interface IJoinProps {
  dum?: any;
}

export const JoinPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

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

  const { setTitle } = useAppContainer();

  useEffect(() => {
    switch (pageIx) {
      case 0:
        setTitle({ prefix: t('joinA'), main: t('project') });
        break;

      case 1:
        setTitle({ prefix: t('personalDetailsPre'), main: t('personalDetailsMain') });
        break;

      case 2:
        setTitle({ prefix: t('reviewApplicationPre'), main: t('reviewApplicationMain') });
        break;

      case 3:
        setTitle({ prefix: t('applicationSentPre'), main: t('applicationSentMain') });
        break;
    }
  }, [pageIx, i18n.language]);

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

  const haveDetails = askPersonal || askPlatform;

  const nextPage = () => {
    if (pageIx + 1 < pages.length) {
      if (pageIx === 0 && !haveDetails) {
        setPageIx(pageIx + 2);
      }
      setPageIx(pageIx + 1);
    }
  };

  const prevPage = () => {
    if (pageIx - 1 >= 0) {
      if (pageIx === 2 && !haveDetails) {
        setPageIx(pageIx - 2);
      }
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

  const pages: React.ReactNode[] = [
    <ViewportPage
      key="0"
      content={
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
            <AppConnectButton></AppConnectButton>
          </Box>
        </Box>
      }
      nav={
        <AppBottomButtons
          left={{ label: 'home', primary: false, action: () => navigate('..') }}
          right={{ label: 'next', primary: true, action: nextPage }}></AppBottomButtons>
      }></ViewportPage>,

    <ViewportPage
      key="3"
      content={
        <Box pad="large">
          <DetailsForm selected={project?.selectedDetails} onChange={(d) => setPersonal(d)}></DetailsForm>
        </Box>
      }
      nav={
        <AppBottomButtons
          popUp={!account ? 'You need to, at least, provide your blockchain account' : undefined}
          left={{ label: 'back', primary: false, action: prevPage }}
          right={{
            label: 'review',
            primary: true,
            action: review,
            disabled: !account,
          }}></AppBottomButtons>
      }></ViewportPage>,
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
          left={{ label: 'back', primary: false, action: prevPage }}
          right={{ label: 'send', primary: true, action: send }}></AppBottomButtons>
      }></ViewportPage>,
    <ViewportPage
      key="5"
      content={
        <Box style={{ flexShrink: 0 }} pad={{ horizontal: 'large' }}>
          <AppCard pad={{ vertical: 'small' }} style={{ flexShrink: 0 }}>
            <Text>{t('applicationReceived')}</Text>
          </AppCard>

          <PAPShare cid={cid}></PAPShare>
        </Box>
      }
      nav={
        <AppBottomButtons
          left={{ label: 'back', primary: false, action: prevPage }}
          right={{ label: 'done', primary: true, action: () => navigate('..') }}></AppBottomButtons>
      }></ViewportPage>,
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
