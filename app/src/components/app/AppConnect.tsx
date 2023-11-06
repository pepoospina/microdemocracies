import { DedicatedWalletConnector } from '@magiclabs/wagmi-connector';
import { InjectedConnector } from '@wagmi/core';
import { Box, Text } from 'grommet';
import { StatusGood } from 'grommet-icons';
import { useAccount, useConnect } from 'wagmi';
import { AppButton, Address } from '../../ui-components';
import { CHAIN_ID } from '../../config/appConfig';

export const AppConnect = (props: {}) => {
  const { isConnected, address } = useAccount();
  const { connect: _connect, connectors, error, isLoading, pendingConnector } = useConnect();

  const magicConnector = connectors.find((c) => c instanceof DedicatedWalletConnector) as DedicatedWalletConnector;
  const injectedConnector = connectors.find((c) => c instanceof InjectedConnector) as InjectedConnector;

  const hasWallet = injectedConnector.ready;

  const connectInjected = () => {
    if (injectedConnector) {
      _connect({ connector: injectedConnector });
    }
  };

  const connectMagic = () => {
    if (injectedConnector) {
      _connect({ connector: magicConnector });
    }
  };

  return !isConnected ? (
    <Box>
      <Box>
        <Box>
          <Text>Connect your Web3 Wallet {!hasWallet ? '(not found)' : ''}</Text>
        </Box>
        <AppButton onClick={() => connectInjected()} label="Connect Wallet" disabled={!hasWallet}></AppButton>
      </Box>
      {!hasWallet ? (
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
