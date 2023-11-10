import { Box, Text } from 'grommet';
import { useState } from 'react';

import { AppButton, AppCard, AppTextArea } from '../../ui-components';
import { AppScreen } from '../../ui-components/AppFormScreen';
import { useVoiceSend } from '../../contexts/VoiceSendContext';
import { AppConnectButton } from '../../components/app/AppConnectButton';
import { RouteNames } from '../../App';
import { useNavigate } from 'react-router-dom';
import { BottomButton } from '../common/BottomButton';
import { FormPrevious } from 'grommet-icons';
import { Statement } from './Statement';
import { useConnectedMember } from '../../contexts/ConnectedAccountContext';
import { useAccountContext } from '../../wallet/AccountContext';

export const VoicePropose = (): JSX.Element => {
  const { isConnected } = useAccountContext();
  const { tokenId } = useConnectedMember();
  const { proposeStatement } = useVoiceSend();
  const [done, setDone] = useState<boolean>(false);
  const navigate = useNavigate();

  const [input, setInput] = useState<string>();
  const handleInput = (input: string) => {
    setInput(input);
  };

  const _proposeStatement = async (input: string) => {
    if (proposeStatement) {
      const success = await proposeStatement(input);
      if (success) {
        setDone(true);
      }
    }
  };

  console.log({ isConnected, input, proposeStatement, done });

  return (
    <AppScreen label="Propose Statement">
      <Box pad="large">
        {!done ? (
          <>
            <Box style={{ marginBottom: '36px' }}>
              <Text margin={{ bottom: 'small' }}>
                <b>Preview</b>
              </Text>

              <Statement
                preview
                statement={{
                  object: { statement: input || '', author: tokenId ? tokenId : 0, backers: [] },
                  signature: '0x',
                  id: '',
                }}></Statement>
            </Box>

            <AppTextArea
              autoResize
              onChange={(event) => handleInput(event.target.value)}
              placeholder="new statement..."
              name="statement"></AppTextArea>

            <Box direction="row" justify="center" style={{ margin: '36px 0', width: '100%' }}>
              {isConnected ? (
                !done ? (
                  <AppButton
                    label="propose statement"
                    onClick={() => {
                      if (input) _proposeStatement(input);
                    }}
                    disabled={!isConnected || !input || !proposeStatement || done}></AppButton>
                ) : (
                  <></>
                )
              ) : (
                <AppConnectButton label="Connect to propose"></AppConnectButton>
              )}
            </Box>
          </>
        ) : (
          <AppCard>Statement Proposed!</AppCard>
        )}
      </Box>
      <BottomButton label="Back" icon={<FormPrevious />} onClick={() => navigate(RouteNames.Voice)}></BottomButton>
    </AppScreen>
  );
};
