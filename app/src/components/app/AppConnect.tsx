import { Box, Text } from 'grommet';
import { StatusGood } from 'grommet-icons';
import { AppButton, Address } from '../../ui-components';
import { CHAIN_ID } from '../../config/appConfig';
import { useAccountContext } from '../../wallet/AccountContext';
import { useAppSigner } from '../../wallet/SignerContext';
import { Loading } from '../../pages/common/WaitingTransaction';
import { useSemaphoreContext } from '../../contexts/SemaphoreContext';

export const AppConnect = (props: {}) => {
  const { hasInjected, connectInjected, connectMagic, signer, address, isConnecting } = useAppSigner();
  const { aaAddress } = useAccountContext();
  const { isCreatingPublicId } = useSemaphoreContext();

  if (isConnecting || isCreatingPublicId) {
    return (
      <Box>
        <Loading label={isCreatingPublicId ? 'Creating Public Id - Waiting for Signatures' : 'Connecting'}></Loading>
      </Box>
    );
  }

  return !signer || !aaAddress ? (
    <Box margin={{ horizontal: 'small' }}>
      <Box margin={{ vertical: 'small' }}>
        <Box>
          <Text>Connect your Web3 Wallet {!hasInjected ? '(not found)' : ''}</Text>
        </Box>
        <AppButton onClick={() => connectInjected()} label="Connect Wallet" disabled={!hasInjected}></AppButton>
      </Box>

      <Box margin={{ vertical: 'small' }}>
        <Box>
          <Text>Connect with your email</Text>
        </Box>
        <AppButton onClick={() => connectMagic()} label="Login with email"></AppButton>
      </Box>
    </Box>
  ) : (
    <>
      <Box>
        <Box direction="row" justify="center" align="center">
          <Box style={{ marginRight: '16px' }}>
            <StatusGood size="48px" />
          </Box>
          <Text size="large">Account Ready</Text>
        </Box>
        <Box align="start" justify="center" style={{ margin: '24px 0px 16px 0px' }}>
          <Box style={{ marginBottom: '24px' }}>
            <Text>
              <b>Account address:</b>
            </Text>
            <Address address={aaAddress} chainId={CHAIN_ID}></Address>
          </Box>
          <Box>
            <Text>
              <b>Controlled by:</b>
            </Text>
            <Address address={address} chainId={CHAIN_ID}></Address>
          </Box>
        </Box>
      </Box>
    </>
  );
};
