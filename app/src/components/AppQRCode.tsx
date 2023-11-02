import { Box } from 'grommet';
import QRCodeSVG from 'qrcode.react';
import { useRef } from 'react';
import { useResponsive } from './app';

export interface IQRCode {
  input: string;
}

export const AppQRCode = (props: IQRCode) => {
  const { vw } = useResponsive();
  const boxRef = useRef<HTMLDivElement>(null);
  const stringifiedData = props.input;

  const size = vw - 40 < 400 ? vw - 40 : 400;

  return (
    <Box fill id="Box" ref={boxRef} align="center" justify="center">
      <QRCodeSVG value={stringifiedData} size={size} />
    </Box>
  );
};
