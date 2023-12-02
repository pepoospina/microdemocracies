import { Box, Button, Text } from 'grommet';
import { Address, AppButton, AppCard, AppHeading } from '../../ui-components';
import { ViewportPage } from '../../components/app/Viewport';
import { Add, Logout } from 'grommet-icons';
import { useAccountContext } from '../../wallet/AccountContext';
import { AppConnect } from '../../components/app/AppConnect';
import { useAccountDataContext } from '../../wallet/AccountDataContext';
import { Loading } from '../common/WaitingTransaction';
import { ProjectCard } from '../project/ProjectCard';
import { useNavigate } from 'react-router-dom';
import { BoxCentered } from '../../ui-components/BoxCentered';
import { AppBottomButton } from '../common/BottomButtons';
import { useTranslation } from 'react-i18next';
import { useAppSigner } from '../../wallet/SignerContext';
import { CHAIN_ID } from '../../config/appConfig';

export const AppHome = (props: {}) => {
  const { address, disconnect } = useAppSigner();
  const { isConnected, aaAddress } = useAccountContext();
  const { projects } = useAccountDataContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const projectClicked = (projectId: number) => {
    navigate(`/p/${projectId}`);
  };

  const userContent = (() => {
    if (!isConnected || !address || !aaAddress) {
      return (
        <BoxCentered fill>
          <AppConnect></AppConnect>
        </BoxCentered>
      );
    }

    return (
      <Box>
        <AppHeading level="2" style={{ marginBottom: '16px' }}>
          {t('connectedAs')}
        </AppHeading>
        <Box direction="row" justify="between">
          <Box>
            <Box direction="row">
              <Text>{t('wallet')}</Text>: {<Address address={aaAddress} chainId={CHAIN_ID}></Address>}
            </Box>
            <Box direction="row">
              <Text>{t('owner')}</Text>: {<Address address={address} chainId={CHAIN_ID}></Address>}
            </Box>
          </Box>
          <Box style={{ flexShrink: 0 }} pad={{ horizontal: 'small ' }} align="center">
            <AppButton style={{ textTransform: 'none' }} onClick={() => disconnect()}>
              <Box align="center">
                <Logout></Logout>
                <Text style={{ textAlign: 'center' }}>{t('logout')}</Text>
              </Box>
            </AppButton>
          </Box>
        </Box>
      </Box>
    );
  })();

  const projectsContent = (() => {
    if (!isConnected) return <></>;
    if (projects === undefined) return <Loading label={t('loadingProjects')}></Loading>;
    if (projects.length === 0)
      return (
        <AppCard>
          <Text>{t('noProjects')}</Text>
        </AppCard>
      );
    return (
      <Box>
        <AppHeading level="2" style={{ marginBottom: '16px' }}>
          {t('yourProjects')}
        </AppHeading>
        {projects.map((project, ix) => {
          return (
            <Box key={ix} style={{ position: 'relative', marginBottom: '16px', flexShrink: 0 }}>
              <ProjectCard project={project}></ProjectCard>
              <Button
                onClick={() => projectClicked(project.projectId)}
                plain
                style={{
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                }}></Button>
            </Box>
          );
        })}
      </Box>
    );
  })();

  return (
    <ViewportPage>
      <Box></Box>

      <Box fill pad={{ horizontal: 'large' }}>
        <Box style={{ flexShrink: 0 }} pad={{ vertical: 'large' }}>
          {userContent}
        </Box>
        <Box style={{ flexShrink: 0 }}>{projectsContent}</Box>
      </Box>

      <AppBottomButton onClick={() => navigate('/start')} icon={<Add></Add>} label={t('startNew')}></AppBottomButton>
    </ViewportPage>
  );
};
