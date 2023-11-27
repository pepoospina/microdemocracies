import { useEffect } from 'react';

import { AppButton } from '../ui-components';
import { useAppSigner } from '../wallet/SignerContext';
import { BoxCentered } from '../ui-components/BoxCentered';
import { useCreateProject } from '../pages/create/useCreateProject';
import { useAccountContext } from '../wallet/AccountContext';

export const TestComponent = () => {
  const { connectInjected } = useAppSigner();
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

  const startTest = async () => {
    connectInjected();
  };

  useEffect(() => {
    if (aaAddress) {
      setWhoStatement('likes tests');
      setDetails({ personal: { firstName: true, lastName: true }, platform: {} });
      setFounderDetails({ personal: { firstName: 'Test', lastName: 'User' }, platforms: [] });
    }
  }, [aaAddress, setDetails, setFounderDetails, setWhoStatement]);

  useEffect(() => {
    if (founderPap && whoStatement && selectedDetails) {
      _createProject();
    }
  }, [founderPap, whoStatement, selectedDetails]);

  useEffect(() => {
    if (isSuccess && projectId) {
      console.log('project created', { projectId });
    }
  }, [isSuccess, projectId]);

  return (
    <BoxCentered fill>
      <AppButton onClick={() => startTest()} label="Start Test" primary></AppButton>
    </BoxCentered>
  );
};
