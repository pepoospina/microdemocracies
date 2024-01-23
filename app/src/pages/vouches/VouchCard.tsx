import { Box, Spinner, Text } from 'grommet';
import { AppVouch } from '../../types';
import { AppButton, AppCard } from '../../ui-components';
import { useNavigate, useParams } from 'react-router-dom';
import { DateManager } from '../../utils/date.manager';
import { AbsoluteRoutes } from '../../route.names';
import { useTranslation } from 'react-i18next';
import { MemberAnchor } from './MemberAnchor';

interface IVouchCard {
  vouch?: AppVouch;
}

export const VoucheCard = (props: IVouchCard): JSX.Element => {
  const { projectId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const vouch = props.vouch;

  const goTo = () => {
    if (vouch && projectId) {
      navigate(AbsoluteRoutes.ProjectMember(projectId, vouch.to.toString()));
    }
  };

  const date = new DateManager();
  const duration = vouch ? date.durationTo(vouch.vouchDate) : undefined;
  const isFounder = vouch && vouch.from > 10e70;

  return (
    <AppButton onClick={() => goTo()} style={{ textTransform: 'none' }}>
      <AppCard>
        {vouch ? (
          <Box fill>
            {isFounder ? (
              <Text>
                <MemberAnchor tokenId={+vouch.to}></MemberAnchor> {t('foundedCommunity')}
              </Text>
            ) : (
              <Text>
                <MemberAnchor tokenId={+vouch.to}></MemberAnchor> {t('invitedBy')}{' '}
                <MemberAnchor tokenId={+vouch.from}></MemberAnchor>
              </Text>
            )}
          </Box>
        ) : (
          <Box fill align="center" justify="center">
            <Spinner></Spinner>
          </Box>
        )}
      </AppCard>
    </AppButton>
  );
};
