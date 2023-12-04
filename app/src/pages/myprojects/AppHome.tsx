import { Box, Button, Text } from 'grommet';
import { Address, AppButton, AppButtonResponsive, AppCard, AppHeading } from '../../ui-components';
import { ViewportPage } from '../../components/app/Viewport';
import { Add, Logout, View } from 'grommet-icons';
import { useAccountContext } from '../../wallet/AccountContext';
import { AppConnect } from '../../components/app/AppConnect';
import { useAccountDataContext } from '../../wallet/AccountDataContext';
import { Loading } from '../common/Loading';
import { ProjectCard } from '../project/ProjectCard';
import { useNavigate } from 'react-router-dom';
import { BoxCentered } from '../../ui-components/BoxCentered';
import { AppBottomButton } from '../common/BottomButtons';
import { useTranslation } from 'react-i18next';
import { useAppSigner } from '../../wallet/SignerContext';
import { CHAIN_ID } from '../../config/appConfig';
import { useState } from 'react';
import { useSemaphoreContext } from '../../contexts/SemaphoreContext';
import { LanguageSelector } from '../account/LanguageSelector';
import { useResponsive, useThemeContext } from '../../components/app';

export const AppHome = (props: {}) => {
  const { address } = useAppSigner();
  const { disconnect } = useSemaphoreContext();
  const { isConnected, aaAddress } = useAccountContext();
  const { projects } = useAccountDataContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { constants } = useThemeContext();

  const { mobile } = useResponsive();

  const [showDetails, setShowDetails] = useState<boolean>(false);

  const projectClicked = (projectId: number) => {
    navigate(`/p/${projectId}`);
  };

  const userContent = (() => {
    if (!isConnected) {
      return (
        <BoxCentered fill>
          <AppConnect></AppConnect>
        </BoxCentered>
      );
    }

    if (!address || !aaAddress) {
      return (
        <BoxCentered fill>
          <Loading></Loading>
        </BoxCentered>
      );
    }

    return (
      <Box>
        <Box direction="row" justify="between" gap="small">
          <AppButtonResponsive
            onClick={() => setShowDetails(!showDetails)}
            icon={<View></View>}
            label={t('details')}></AppButtonResponsive>
          <LanguageSelector></LanguageSelector>
          <AppButtonResponsive
            reverse
            icon={<Logout></Logout>}
            label={t('logout')}
            onClick={() => disconnect()}></AppButtonResponsive>
        </Box>
        {showDetails ? (
          <Box pad={{ top: 'medium' }}>
            <Box direction="row" margin={{ bottom: 'small' }}>
              <Text>{t('wallet')}</Text>: {<Address address={aaAddress} chainId={CHAIN_ID}></Address>}
            </Box>
            <Box direction="row">
              <Text>{t('owner')}</Text>: {<Address address={address} chainId={CHAIN_ID}></Address>}
            </Box>
          </Box>
        ) : (
          <></>
        )}
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
