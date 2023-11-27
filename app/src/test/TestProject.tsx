import { useEffect } from 'react';

import { AppButton, AppHeading } from '../ui-components';
import { BoxCentered } from '../ui-components/BoxCentered';
import { useVoiceSend } from '../contexts/VoiceSendContext';
import { useProjectContext } from '../contexts/ProjectContext';
import { useVoiceRead } from '../contexts/VoiceReadContext';
import { useAppSigner } from '../wallet/SignerContext';
import { useAccountContext } from '../wallet/AccountContext';

export const TestProject = () => {
  const { connectTest } = useAppSigner();
  const { isConnected } = useAccountContext();
  const { projectId } = useProjectContext();
  const { proposeStatement, isSuccess: isSuccessPropose } = useVoiceSend();
  const { statements } = useVoiceRead();

  /** each step triggers the useEffect below it. */
  const connect = () => {
    connectTest(0);
  };
  const startTest = async () => {
    if (proposeStatement) {
      console.log('[TEST] proposing statement');
      proposeStatement('Test statement');
    }
  };

  /** project created ? post a statement */
  useEffect(() => {
    if (isSuccessPropose) {
      console.log('[TEST] statement proposed');
      console.log('[TEST] getting statements');
    }
  }, [isSuccessPropose]);

  useEffect(() => {
    console.log({ statements });
  }, [statements]);

  return (
    <BoxCentered fill gap="large">
      <AppHeading level="3">Project {projectId}</AppHeading>
      {!isConnected ? <AppButton onClick={() => connect()} label="Connect" primary></AppButton> : <></>}
      <AppButton
        disabled={proposeStatement === undefined}
        onClick={() => startTest()}
        label="Start Test"
        primary></AppButton>
    </BoxCentered>
  );
};
