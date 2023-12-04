import { Box, Text } from 'grommet';
import { useEffect, useState } from 'react';

import { AppButton, AppCard } from '../../ui-components';
import { AppConnectButton } from '../../components/app/AppConnectButton';
import { useNavigate } from 'react-router-dom';
import { AppBottomButton } from '../common/BottomButtons';
import { FormPrevious } from 'grommet-icons';
import { useAccountContext } from '../../wallet/AccountContext';
import { StatementEditable } from './StatementEditable';
import { useSemaphoreContext } from '../../contexts/SemaphoreContext';
import { Loading } from '../common/Loading';
import { ViewportHeadingLarge, ViewportPage } from '../../components/app/Viewport';
import { useStatementSend } from './useStatementSend';
import { useTranslation } from 'react-i18next';

export const VoicePropose = (): JSX.Element => {
  const { t } = useTranslation();
  const { isConnected } = useAccountContext();
  const { proposeStatement, isSuccessStatement } = useStatementSend();

  const { publicId } = useSemaphoreContext();

  const [done, setDone] = useState<boolean>(false);
  const [isProposing, setIsProposing] = useState<boolean>(false);
  const navigate = useNavigate();

  const [input, setInput] = useState<string>();

  const _proposeStatement = async (input: string) => {
    if (proposeStatement) {
      setIsProposing(true);
      proposeStatement(input);
    }
  };

  useEffect(() => {
    if (isSuccessStatement) {
      setIsProposing(false);
      setDone(true);
      navigate('../..');
    }
  }, [isSuccessStatement]);

  const readyToPropose = isConnected && input && proposeStatement !== undefined && publicId && !done;

  return (
    <ViewportPage>
      <ViewportHeadingLarge label={t('proposeStatement')}></ViewportHeadingLarge>

      <Box pad="large">
        {!done ? (
          <>
            <Box style={{ marginBottom: '36px' }}>
              <StatementEditable
                editable={!isProposing}
                onChanged={(value?: string) => {
                  if (value) setInput(value);
                }}
                placeholder={`${t('newStatement')}...`}></StatementEditable>
            </Box>

            <AppCard>
              <Text>{t('proposeInfo')}!</Text>
            </AppCard>

            <Box justify="center" style={{ margin: '36px 0', width: '100%' }}>
              {!isConnected ? <AppConnectButton label={t('connectToPropose')}></AppConnectButton> : <></>}
              {isProposing ? (
                <Box>
                  <Loading label={t('sendingProposal')}></Loading>
                </Box>
              ) : (
                <AppButton
                  label={t('proposeStatementBtn')}
                  onClick={() => {
                    if (input) _proposeStatement(input);
                  }}
                  disabled={!readyToPropose || isProposing}></AppButton>
              )}
            </Box>
          </>
        ) : (
          <AppCard>{t('statementProposed')}!</AppCard>
        )}
      </Box>
      <AppBottomButton label={t('back')} icon={<FormPrevious />} onClick={() => navigate(-1)}></AppBottomButton>
    </ViewportPage>
  );
};
