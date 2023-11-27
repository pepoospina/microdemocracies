import { useEffect } from 'react';

import { AppButton } from '../ui-components';
import { useAppSigner } from '../wallet/SignerContext';
import { BoxCentered } from '../ui-components/BoxCentered';
import { useCreateProject } from '../pages/create/useCreateProject';
import { useAccountContext } from '../wallet/AccountContext';
import { useVoiceSend } from '../contexts/VoiceSendContext';
import { useNavigate } from 'react-router-dom';

export const TestCreateProject = () => {
  const navigate = useNavigate();
  const { connectTest } = useAppSigner();
  const { aaAddress } = useAccountContext();

  const {
    founderPap,
    whoStatement,
    selectedDetails,
    isSuccess,
    projectId,
    setFounderDetails,
    setWhoStatement,
    setDetails,
    createProject: _createProject,
  } = useCreateProject();

  /** each step triggers the useEffect below it. */
  const startTest = async () => {
    connectTest(0);
  };

  /** signer connected ? prepare project details */
  useEffect(() => {
    if (aaAddress) {
      console.log('[TEST] signer created', { aaAddress });
      setWhoStatement('likes tests');
      setDetails({ personal: { firstName: true, lastName: true }, platform: {} });
      setFounderDetails({ personal: { firstName: 'Test', lastName: 'User' }, platforms: [] });
    }
  }, [aaAddress, setDetails, setFounderDetails, setWhoStatement]);

  /** [project details ? create project */
  useEffect(() => {
    if (founderPap && whoStatement && selectedDetails) {
      console.log('[TEST] project configured', { founderPap, whoStatement, selectedDetails });
      _createProject();
    }
  }, [founderPap, whoStatement, selectedDetails]);

  /** project created ? naviate to project test  */
  useEffect(() => {
    if (isSuccess && projectId) {
      console.log('[TEST] project created', { projectId });
      navigate(`/p/${projectId}/test`);
    }
  }, [isSuccess, projectId]);

  return (
    <BoxCentered fill>
      <AppButton onClick={() => startTest()} label="Start Test" primary></AppButton>
    </BoxCentered>
  );
};
