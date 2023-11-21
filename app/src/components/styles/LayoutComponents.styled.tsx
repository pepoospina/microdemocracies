import {
  AreasType,
  Box,
  BoxExtendedProps,
  Grid,
  GridColumnsType,
  GridExtendedProps,
  GridSizeType,
  ResponsiveContext,
} from 'grommet';
import { ReactNode } from 'react';
import { IElement, useThemeContext } from '../app';

export const MAX_WIDTH_LANDING = 1600;

export const ViewportContainer = (props: IElement) => {
  const height = 'calc(100vh)';
  return (
    <Box
      id="viewport-container"
      style={{
        height,
        width: '100vw',
        overflow: 'hidden',
        maxWidth: `${MAX_WIDTH_LANDING}px`,
        margin: '0 auto',
      }}>
      {props.children}
    </Box>
  );
};

export const ViewportPage = (props: { children: ReactNode[] }) => {
  return (
    <Box
      id="viewport-page"
      style={{
        height: '100%',
        width: '100%',
        maxWidth: '700px',
        margin: '0 auto',
        overflow: 'hidden',
      }}>
      <Box id="header" style={{ height: '60px' }}>
        {props.children[0]}
      </Box>
      <Box id="content" style={{ flexGrow: 1, overflowY: 'auto' }}>
        {props.children[1]}
      </Box>
      <Box id="nav" style={{ height: '60px', flexShrink: 0 }}>
        {props.children[2]}
      </Box>
    </Box>
  );
};

export interface ITwoColumns {
  children?: ReactNode | ReactNode[];
  grid?: GridExtendedProps;
  boxes?: BoxExtendedProps;
  gap?: number;
  line?: boolean;
  frs?: number[];
}

export const TwoColumns = (props: ITwoColumns) => {
  const { constants } = useThemeContext();

  const gap = props.gap !== undefined ? props.gap : 78; // minus 2 of the line
  const showLine = props.line !== undefined ? props.line : true;
  const frs = props.frs || [1, 1];

  const colWidths = [`${frs[0]}fr`, `${frs[1]}fr`];

  return (
    <Grid
      fill
      columns={[colWidths[0], `${gap}px`, colWidths[1]]}
      rows={['auto']}
      areas={[
        { name: 'left', start: [0, 0], end: [0, 0] },
        { name: 'center', start: [1, 0], end: [1, 0] },
        { name: 'right', start: [2, 0], end: [2, 0] },
      ]}
      style={{ ...props.grid?.style }}>
      <Box gridArea="left" direction="column" {...props.boxes}>
        {(props.children as React.ReactNode[])[0]}
      </Box>
      <Box gridArea="center" align="center">
        {showLine ? (
          <Box
            style={{
              height: '100%',
              width: '2px',
              backgroundColor: constants.colors.backgroundLight,
            }}></Box>
        ) : (
          <></>
        )}
      </Box>
      <Box gridArea="right" direction="column" {...props.boxes}>
        {(props.children as React.ReactNode[])[1]}
      </Box>
    </Grid>
  );
};

export enum Breakpoint {
  small = 'small',
  medium = 'medium',
  large = 'large',
  xlarge = 'xlarge',
}

export interface IResponsiveGrid extends GridExtendedProps {
  columnsAt: Record<Breakpoint, GridColumnsType>;
  rowsAt: Record<Breakpoint, GridSizeType | GridSizeType[]>;
  areasAt?: Record<Breakpoint, AreasType>;
}

export const ResponsiveGrid = (props: IResponsiveGrid) => (
  <ResponsiveContext.Consumer>
    {(_size) => {
      const size = _size as Breakpoint;

      const columnsVal = props.columnsAt[size];
      const rowsVal = props.rowsAt[size];
      const areasVal = props.areasAt ? props.areasAt[size] : undefined;

      return (
        <Grid {...props} rows={rowsVal} columns={columnsVal} areas={areasVal}>
          {props.children}
        </Grid>
      );
    }}
  </ResponsiveContext.Consumer>
);
