import {
  Anchor,
  AreasType,
  Box,
  BoxExtendedProps,
  Grid,
  GridColumnsType,
  GridExtendedProps,
  GridSizeType,
  ResponsiveContext,
  Text,
} from 'grommet';
import { ReactNode } from 'react';

import { IElement, useResponsive, useThemeContext } from '.';
import { BUILD_ID } from '../../config/appConfig';
import { AppHeading } from '../../ui-components/AppHeading';
import { TwitterIcon } from './Icons';

export const MAX_WIDTH_LANDING = 1600;
export const MAX_WIDTH_APP = 700;

export const ViewportContainer = (props: IElement) => {
  const { constants } = useThemeContext();
  const footerHeight = '48px';

  return (
    <>
      <Box
        id="viewport-container"
        style={{
          height: `calc(100vh - ${footerHeight})`,
          width: '100vw',
          overflow: 'hidden',
          maxWidth: `${MAX_WIDTH_LANDING}px`,
          margin: '0 auto',
          ...props.style,
        }}>
        {props.children}
      </Box>
      <Box
        id="footer"
        style={{
          height: footerHeight,
          flexShrink: 0,
          backgroundColor: constants.colors.primary,
        }}
        pad="medium"
        justify="center"
        align="center">
        <Box
          direction="row"
          justify="center"
          fill
          align="center"
          style={{ position: 'relative' }}>
          <Anchor href={`https://twitter.com/udemocracies`} target="_blank">
            <Box pad="medium">
              <TwitterIcon size={14} style={{}}></TwitterIcon>
            </Box>
          </Anchor>
          <Box
            style={{
              position: 'absolute',
              right: '0px',
              bottom: '0px',
            }}>
            <Text size="6px" color="white">
              Build: {BUILD_ID?.substring(0, 7)}
            </Text>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export const ViewportHeadingSmall = (props: { label: ReactNode }) => {
  return (
    <Box justify="center" align="center" pad="medium">
      <Text size="22px" weight="bold">
        {props.label}
      </Text>
    </Box>
  );
};

export const ViewportHeadingLarge = (props: { label: ReactNode }) => {
  return (
    <Box
      justify="center"
      align="center"
      pad="medium"
      style={{ textAlign: 'center' }}>
      <AppHeading level="1">{props.label}</AppHeading>
    </Box>
  );
};

/**
 * fill the vertical space with a scrollable content area, and leave the bottom
 * fixed to the navigation buttons
 */
export const ViewportPage = (props: { content: ReactNode; nav: ReactNode }) => {
  const { mobile } = useResponsive();
  const { constants } = useThemeContext();
  const pad = mobile ? 'none' : 'large';

  return (
    <Box
      id="viewport-page"
      pad={pad}
      style={{
        height: '100%',
        width: '100%',
        maxWidth: `${MAX_WIDTH_APP}px`,
        margin: '0 auto',
        overflow: 'hidden',
      }}>
      <Box id="header" style={{ flexGrow: 1, overflowY: 'auto' }}>
        <Box style={{ flexShrink: 0 }}>{props.content}</Box>
      </Box>
      <Box
        id="nav"
        style={{
          height: '80px',
          flexShrink: 0,
        }}
        justify="center">
        {props.nav}
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
