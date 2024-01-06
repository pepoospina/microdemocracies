import { useEffect, useState } from 'react';

import { AppButton, AppHeading } from '../ui-components';
import { BoxCentered } from '../ui-components/BoxCentered';
import { useProjectContext } from '../contexts/ProjectContext';
import { useVoiceRead } from '../contexts/VoiceReadContext';
import { useAppSigner } from '../wallet/SignerContext';
import { useAccountContext } from '../wallet/AccountContext';
import { StatementCard } from '../pages/voice/StatementCard';
import { Box } from 'grommet';
import { useBackingSend } from '../pages/voice/useBackingSend';
import { useStatementSend } from '../pages/voice/useStatementSend';

export const TestProject = () => {
  const { connectTest } = useAppSigner();
  const { isConnected } = useAccountContext();
  const { projectId } = useProjectContext();
  const { proposeStatement, isSuccessStatement } = useStatementSend();
  const { backStatement } = useBackingSend();
  const { statements } = useVoiceRead();

  const [random, setRandom] = useState<string>();

  /** each step triggers the useEffect below it. */
  const connect = () => {
    connectTest(0);
  };

  const startTest = async () => {
    if (!proposeStatement) {
      throw new Error('unexpected');
    }

    console.log('[TEST] proposing statement');
    const _random = Date.now().toString();

    setRandom(_random);
    proposeStatement(`Test statement ${_random}`);
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

        const res2 = await backStatement(found.id, found.treeId);
        if (res2.success) {
          console.error('request succeded');
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

      <Box style={{ overflowY: 'auto' }} pad="medium">
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
