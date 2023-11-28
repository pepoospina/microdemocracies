import { useEffect, useState } from 'react';

import { AppButton, AppHeading } from '../ui-components';
import { BoxCentered } from '../ui-components/BoxCentered';
import { useVoiceSend } from '../contexts/VoiceSendContext';
import { useProjectContext } from '../contexts/ProjectContext';
import { useVoiceRead } from '../contexts/VoiceReadContext';
import { useAppSigner } from '../wallet/SignerContext';
import { useAccountContext } from '../wallet/AccountContext';
import { StatementCard } from '../pages/voice/StatementCard';
import { Box } from 'grommet';

export const TestProject = () => {
  const { connectTest } = useAppSigner();
  const { isConnected } = useAccountContext();
  const { projectId } = useProjectContext();
  const { proposeStatement, isSuccessStatement, backStatement, isSuccessBacking } = useVoiceSend();
  const { statements } = useVoiceRead();

  const [random, setRandom] = useState<string>();

  /** each step triggers the useEffect below it. */
  const connect = () => {
    connectTest(0);
  };
  const startTest = async () => {
    if (proposeStatement) {
      console.log('[TEST] proposing statement');
      const _random = Date.now().toString();
      setRandom(_random);
      proposeStatement(`Test statement ${_random}`);
    }
  };

  /** project created ? post a statement */
  useEffect(() => {
    if (isSuccessStatement) {
      console.log('[TEST] statement proposed');
    }
  }, [isSuccessStatement]);

  /** statement posted => post backing */
  const runBackStatement = async () => {
    if (random && statements) {
      const found = statements.find((s) => s.statement.includes(random));
      if (found && backStatement) {
        console.log('[TEST] statement found', { found });
        const res = await backStatement(found.id, found.treeId);
        console.log('backing posted', res);

        /** try again */
        try {
          const res = await backStatement(found.id, found.treeId);
          console.error('did not failed', res);
        } catch (e) {
          console.log('failed as expected', e);
        }
      }
    }
  };

  useEffect(() => {
    runBackStatement();
  }, [statements, random]);

  return (
    <BoxCentered fill gap="large">
      <AppHeading level="3">Project {projectId}</AppHeading>
      {!isConnected ? <AppButton onClick={() => connect()} label="Connect" primary></AppButton> : <></>}
      <AppButton
        disabled={proposeStatement === undefined}
        onClick={() => startTest()}
        label="Start Test"
        primary></AppButton>

      <Box style={{ overflowY: 'auto' }}>
        {statements ? (
          statements.map((statement, ix) => {
            return (
              <StatementCard containerStyle={{ marginBottom: '22px' }} key={ix} statement={statement}></StatementCard>
            );
          })
        ) : (
          <></>
        )}
      </Box>
    </BoxCentered>
  );
};
