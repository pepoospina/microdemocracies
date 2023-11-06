import { Box, Text } from 'grommet';
import { StatusGood } from 'grommet-icons';
import { useAccount } from 'wagmi';
import { AppButton, Address } from '../../ui-components';
import { CHAIN_ID } from '../../config/appConfig';
import { useProviderContext } from '../../wallet/ProviderContext';

export const AppConnect = (props: {}) => {
  const { isConnected, address } = useAccount();
  const { hasInjected, connectInjected, connectMagic } = useProviderContext();

  return !isConnected ? (
    <Box>
      <Box>
        <Box>
          <Text>Connect your Web3 Wallet {!hasInjected ? '(not found)' : ''}</Text>
        </Box>
        <AppButton onClick={() => connectInjected()} label="Connect Wallet" disabled={!hasInjected}></AppButton>
      </Box>
      {!hasInjected ? (
        <Box>
          <Box>
            <Text>Sign-up</Text>
          </Box>
          <AppButton onClick={() => connectMagic()} label="Sign-up"></AppButton>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  ) : (
    <>
      <Box>
        <Box direction="row" justify="center" align="center">
          <Box style={{ marginRight: '16px' }}>
            <StatusGood size="48px" />
          </Box>
          <Text size="large">Account Found!</Text>
        </Box>
        <Box align="center" justify="center" style={{ margin: '16px 0px' }}>
          <Address address={address} chainId={CHAIN_ID}></Address>
        </Box>
      </Box>
    </>
  );
};
