import { Box, Text } from 'grommet';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';

import { AppButton, AppCard } from '../../ui-components';
import { RouteNames } from '../MainPage';
import { useNavigate } from 'react-router-dom';
import { AppFormScreen } from '../../ui-components/AppFormScreen';
import { FormPrevious } from 'grommet-icons';
import { BottomButton } from '../common/BottomButton';

export const VouchPage = (): JSX.Element => {
  const [scan, setScan] = useState<boolean>(false);
  const navigate = useNavigate();

  const setResult = (result: string) => {
    navigate(RouteNames.VouchAccount(result));
  };

  return (
    <AppFormScreen label="Vouch">
      <Box pad="large">
        <Box style={{ flexShrink: 0 }}>
          <AppCard style={{ marginBottom: '16px' }}>
            <Text>Vouch for a new member of the registry.</Text>
          </AppCard>
        </Box>
        {scan ? (
          <Box fill style={{ maxWidth: '500px', margin: '0 auto' }}>
            <QrScanner onDecode={(result) => setResult(result)} onError={(error) => console.log(error?.message)} />
          </Box>
        ) : (
          <AppCard style={{ marginBottom: '32px' }}>
            <Box style={{ margin: '0px 0 12px 0' }}>
              <Text>Only vouch for members who:</Text>
            </Box>

            <Box style={{ margin: '6px 0' }}>
              <Text>
                <b>- Are a real person.</b>
              </Text>
            </Box>
            <Box style={{ margin: '6px 0' }}>
              <Text>
                <b>- Are not already registered.</b>
              </Text>
            </Box>
            <Box style={{ margin: '6px 0' }}>
              <Text>
                <b>- Want to be part of the registry.</b>
              </Text>
            </Box>
          </AppCard>
        )}
        <AppButton label={!scan ? 'agree & scan' : 'cancel'} onClick={() => setScan(!scan)} primary></AppButton>
      </Box>
      <BottomButton icon={<FormPrevious />} label="back" onClick={() => navigate(RouteNames.Base)}></BottomButton>
    </AppFormScreen>
  );
};
