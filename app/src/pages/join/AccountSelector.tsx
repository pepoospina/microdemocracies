import { Box, BoxExtendedProps, Text } from 'grommet';

import { Address, AppButton, AppFormField, AppInput, FieldLabel } from '../../ui-components';
import { useEffect, useState } from 'react';
import { useRegistry } from '../../contexts/RegistryContext';
import { AppConnect } from '../../components/app/AppConnect';
import { isAddress } from 'viem';
import { StatusGood } from 'grommet-icons';
import { HexStr } from '../../types';
import { appConfig } from '../../config';

export interface IAccountSelector extends BoxExtendedProps {
  onSelected: (account?: string) => any;
}

export const AppAccountSelector = (props: IAccountSelector) => {
  const { connectedAddress } = useRegistry();

  const [cancelled, setCancelled] = useState<boolean>(true);
  const [inputAddress, setInputAddress] = useState<HexStr>();
  const [chosenAddress, setChosenAddress] = useState<HexStr>();

  useEffect(() => {
    if (inputAddress) {
      setChosenAddress(inputAddress);
    } else if (connectedAddress && !cancelled) {
      setChosenAddress(connectedAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputAddress, connectedAddress]);

  useEffect(() => {
    props.onSelected(chosenAddress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosenAddress, props.onSelected]);

  const handleInput = (input: string) => {
    if (isAddress(input)) {
      setInputAddress(input);
    }
  };

  const cancel = () => {
    setInputAddress(undefined);
    setChosenAddress(undefined);
    setCancelled(true);
  };

  const reuseConnected = () => {
    setChosenAddress(connectedAddress);
  };

  return (
    <Box {...props}>
      {!chosenAddress ? (
        <Box>
          {!connectedAddress ? (
            <AppConnect></AppConnect>
          ) : (
            <AppButton
              onClick={() => reuseConnected()}
              label={`click to use (${connectedAddress?.slice(0, 8)}...)`}></AppButton>
          )}
          <Box margin="10px 0px">
            <Text>or</Text>
          </Box>
          <AppFormField
            onChange={(event) => handleInput(event.target.value)}
            label={<FieldLabel label="Enter address manually"></FieldLabel>}>
            <AppInput placeholder="0x..."></AppInput>
          </AppFormField>
        </Box>
      ) : (
        <></>
      )}

      {chosenAddress ? (
        <Box>
          <Box direction="row" justify="center" align="center">
            <Box style={{ marginRight: '16px' }}>
              <StatusGood size="48px" />
            </Box>
            <Text size="large">Account chosen!</Text>
          </Box>
          <Box align="center" justify="center" style={{ margin: '16px 0px' }}>
            <Address address={chosenAddress} chainId={appConfig.CHAIN.id}></Address>
          </Box>
          <Box>
            <AppButton label="REMOVE SELECTION" onClick={() => cancel()}></AppButton>
          </Box>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};
