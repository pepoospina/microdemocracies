import { Box } from 'grommet';
import { useState } from 'react';

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

export const VoicePropose = (): JSX.Element => {
  const { isConnected } = useAccountContext();
  const { proposeStatement } = useVoiceSend();
  const { publicId, connectIdentity } = useSemaphoreContext();

  const [done, setDone] = useState<boolean>(false);
  const navigate = useNavigate();

  const [input, setInput] = useState<string>();

  const _proposeStatement = async (input: string) => {
    if (proposeStatement) {
      const success = await proposeStatement(input);
      if (success) {
        setDone(true);
      }
    }
  };

  const readyToPropose = isConnected && input && proposeStatement !== undefined && publicId && !done;
  console.log({ isConnected, input, proposeStatement, done });

  return (
    <AppScreen label="Propose Statement">
      <Box pad="large">
        {!done ? (
          <>
            <Box style={{ marginBottom: '36px' }}>
              <StatementEditable
                value={'Test proposal'}
                editable
                onChanged={(value?: string) => {
                  if (value) setInput(value);
                }}
                placeholder="new statement..."></StatementEditable>
            </Box>
            <Box justify="center" style={{ margin: '36px 0', width: '100%' }}>
              {!isConnected ? <AppConnectButton label="Connect to propose"></AppConnectButton> : <></>}
              {isConnected && publicId === undefined ? (
                <AppButton
                  onClick={() => {
                    if (connectIdentity) connectIdentity();
                  }}
                  label="Setup"
                  disabled={connectIdentity === undefined}></AppButton>
              ) : (
                <></>
              )}
              <AppButton
                label="propose statement"
                onClick={() => {
                  if (input) _proposeStatement(input);
                }}
                disabled={!readyToPropose}></AppButton>
            </Box>
          </>
        ) : (
          <AppCard>Statement Proposed!</AppCard>
        )}
      </Box>
      <BottomButton label="Voice" icon={<FormPrevious />} onClick={() => navigate('..')}></BottomButton>
    </AppScreen>
  );
};
