import { Box, BoxExtendedProps } from 'grommet';
import { CSSProperties } from 'react';
import { getAddress } from '../utils/addresses';
import { useThemeContext } from '../components/app';
import { CHAIN_EXPLORER_BASE } from '../config/appConfig';

interface IAddress extends BoxExtendedProps {
  address: `0x${string}` | undefined;
  chainId: number | undefined;
  disableClick?: boolean;
  digits?: number;
}

export const Address = (props: IAddress): JSX.Element => {
  const { constants } = useThemeContext();

  const digits = props.digits || 5;

  if (props.address === null || props.address === undefined || props.chainId === null || props.chainId === undefined) {
    return <></>;
  }

  const disableClick = props.disableClick !== undefined ? props.disableClick : false;

  const exploreAddress = (address: `0x${string}` | undefined) => `${CHAIN_EXPLORER_BASE}/address/${address}`;

  const address = getAddress(props.address);
  const text = address ? `${address.slice(0, digits)}...${address.slice(address.length - digits, address.length)}` : '';

  const url = exploreAddress !== undefined ? exploreAddress(props.address) : undefined;

  const style: CSSProperties = {
    fontSize: '18px',
    color: constants.colors.links,
    textDecoration: 'none',
    ...props.style,
  };

  return (
    <Box {...props}>
      <Box align="center" direction="row">
        {disableClick ? (
          <Box style={style}>{text}</Box>
        ) : url !== undefined ? (
          <a style={style} target="_blank" rel="noreferrer" href={url}>
            {text}
          </a>
        ) : (
          text
        )}
      </Box>
    </Box>
  );
};
