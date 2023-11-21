import { Box } from 'grommet';
import { useEffect, useState } from 'react';

import { AppButton, AppCard } from '../../ui-components';
import { AppScreen } from '../../ui-components/AppFormScreen';
import { useVoiceSend } from '../../contexts/VoiceSendContext';
import { AppConnectButton } from '../../components/app/AppConnectButton';
import { useNavigate } from 'react-router-dom';
import { BottomButton } from '../common/BottomButton';
import { FormPrevious } from 'grommet-icons';
import { useAccountContext } from '../../wallet/AccountContext';
import { StatementEditable } from './StatementEditable';
import { useSemaphoreContext } from '../../contexts/SemaphoreContext';
import { Loading } from '../common/WaitingTransaction';
import { useVoiceRead } from '../../contexts/VoiceReadContext';

export const VoicePropose = (): JSX.Element => {
  const { isConnected } = useAccountContext();
  const { proposeStatement } = useVoiceSend();
  const { refetchStatements } = useVoiceRead();

  const { publicId } = useSemaphoreContext();

  const [done, setDone] = useState<boolean>(false);
  const [isProposing, setIsProposing] = useState<boolean>(false);
  const navigate = useNavigate();

  const [input, setInput] = useState<string>();

  const _proposeStatement = async (input: string) => {
    if (proposeStatement) {
      setIsProposing(true);
      const success = await proposeStatement(input);
      if (success) {
        setIsProposing(true);
        setDone(true);
      }
    }
  };

  useEffect(() => {
    if (done) {
      refetchStatements();
      navigate('../..');
    }
  }, [done]);

  const readyToPropose = isConnected && input && proposeStatement !== undefined && publicId && !done;

  return (
    <AppScreen label="Propose Statement">
      <Box pad="large">
        {!done ? (
          <>
            <Box style={{ marginBottom: '36px' }}>
              <StatementEditable
                editable={!isProposing}
                onChanged={(value?: string) => {
                  if (value) setInput(value);
                }}
                placeholder="new statement..."></StatementEditable>
            </Box>
            <Box justify="center" style={{ margin: '36px 0', width: '100%' }}>
              {!isConnected ? <AppConnectButton label="Connect to propose"></AppConnectButton> : <></>}
              {isProposing ? (
                <Box>
                  <Loading label="sending anonymous proposal"></Loading>
                </Box>
              ) : (
                <AppButton
                  label="propose statement"
                  onClick={() => {
                    if (input) _proposeStatement(input);
                  }}
                  disabled={!readyToPropose || isProposing}></AppButton>
              )}
            </Box>
          </>
        ) : (
          <AppCard>Statement Proposed!</AppCard>
        )}
      </Box>
      <BottomButton label="Back" icon={<FormPrevious />} onClick={() => navigate(-1)}></BottomButton>
    </AppScreen>
  );
};
