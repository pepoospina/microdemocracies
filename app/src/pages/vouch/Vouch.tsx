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
    <AppScreen label="Vouch">
      <Box pad="large">
        <Box style={{ flexShrink: 0 }}>
          <Box style={{ marginBottom: '36px', flexShrink: 0 }}>
            <StatementEditable value={project?.whoStatement}></StatementEditable>
          </Box>
          {scan ? (
            <Box fill style={{ maxWidth: '500px', margin: '0 auto' }}>
              <QrScanner onDecode={(result) => setResult(result)} onError={(error) => console.log(error?.message)} />
            </Box>
          ) : (
            <AppCard style={{ marginBottom: '16px' }}>
              <Text>
                Vouching protects the community. Vouch only people who are expected to join your micro(r)evolution.
              </Text>
            </AppCard>
          )}
        </Box>

        <AppButton
          label={!scan ? 'agree & scan' : 'cancel'}
          onClick={() => setScan(!scan)}
          primary
          style={{ marginBottom: '16px' }}></AppButton>
        <AppButton label={'invite'} onClick={() => invite()}></AppButton>
      </Box>
      <BottomButton icon={<FormPrevious />} label="home" onClick={goHome}></BottomButton>
    </AppScreen>
  );
};
