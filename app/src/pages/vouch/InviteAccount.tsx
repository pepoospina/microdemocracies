import { Box, Spinner, Text } from 'grommet';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormPrevious } from 'grommet-icons';

import { getEntity } from '../../utils/store';
import { Entity, PAP } from '../../types';
import { MemberContext } from '../../contexts/MemberContext';
import { AccountPerson } from '../account/AccountPerson';
import { AppBottomButton } from '../common/BottomButtons';
import { ViewportPage } from '../../components/app/Viewport';
import { VouchMemberWidget } from './VouchMemberWidget';
import { useTranslation } from 'react-i18next';

export const InviteAccount = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hash } = useParams();

  /** convert hash into pap and send to VouchWidget */
  const [pap, setPap] = useState<Entity<PAP>>();

  useEffect(() => {
    if (hash) {
      getEntity<PAP>(hash).then((pap) => {
        setPap(pap);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);

  const content = (() => {
    if (!pap)
      return (
        <Box fill align="center" justify="center">
          <Spinner></Spinner>
        </Box>
      );

    return (
      <>
        <Box pad="large" fill>
          <Box>
            <AccountPerson pap={pap.object} cardStyle={{ marginBottom: '32px' }}></AccountPerson>
            <MemberContext address={pap.object.account}>
              <VouchMemberWidget pap={pap}></VouchMemberWidget>
            </MemberContext>
          </Box>
        </Box>
      </>
    );
  })();

  return (
    <ViewportPage>
      <Box justify="center" align="center" style={{ flexShrink: '0', height: '50px' }}>
        <Text size="22px" weight="bold">
          {t('appName')}
        </Text>
      </Box>

      {content}

      <AppBottomButton onClick={() => navigate(-1)} icon={<FormPrevious></FormPrevious>} label="back"></AppBottomButton>
    </ViewportPage>
  );
};
