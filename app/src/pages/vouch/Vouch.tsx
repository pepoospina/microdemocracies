import { Box, Text } from 'grommet';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';

import { AppButton, AppCard } from '../../ui-components';
import { RouteNames } from '../../App';
import { useNavigate } from 'react-router-dom';
import { AppScreen } from '../../ui-components/AppFormScreen';
import { FormPrevious } from 'grommet-icons';
import { BottomButton } from '../common/BottomButton';
import { StatementEditable } from '../voice/StatementEditable';
import { useProjectContext } from '../../contexts/ProjectContext';

export const VouchPage = (): JSX.Element => {
  const [scan, setScan] = useState<boolean>(false);
  const { project, goHome } = useProjectContext();
  const navigate = useNavigate();

  const setResult = (result: string) => {
    navigate(RouteNames.VouchAccount(result));
  };

  const invite = () => {};

  return (
    <AppScreen label="Invite">
      <Box pad="large">
        <Box style={{ flexShrink: 0 }}>
          <Box style={{ marginBottom: '36px', flexShrink: 0 }}>
            <Text style={{ marginBottom: '16px' }}>Remember, this micro(r)evolution is for anyone who:</Text>
            <StatementEditable value={project?.whoStatement}></StatementEditable>
          </Box>
          {scan ? (
            <Box fill style={{ maxWidth: '500px', margin: '0 auto' }}>
              <QrScanner onDecode={(result) => setResult(result)} onError={(error) => console.log(error?.message)} />
            </Box>
          ) : (
            <></>
          )}
        </Box>

        <AppButton
          label={!scan ? 'scan member details' : 'cancel'}
          onClick={() => setScan(!scan)}
          primary
          style={{ marginBottom: '16px' }}></AppButton>
        {/* <AppButton label={'invite'} onClick={() => invite()}></AppButton> */}
      </Box>
      <BottomButton icon={<FormPrevious />} label="home" onClick={goHome}></BottomButton>
    </AppScreen>
  );
};
