import { BoxExtendedProps, Box } from 'grommet';
import { AppHeading } from './AppHeading';
import React, { ReactElement } from 'react';

export interface IAppFormScreen extends BoxExtendedProps {
  label?: string;
}

export const AppScreen = (props: IAppFormScreen) => {
  if (!props.children) {
    throw new Error('Two children');
  }
  const children = props.children as Array<React.ReactNode>;
  const content = children[0] as ReactElement;
  if (!content) throw new Error('Content component not provided');

  const styledContent = React.cloneElement(content, { style: { flexGrow: 1, ...content.props.style } });

  return (
    <Box {...props} style={{ height: '100%', ...props.style }} align="center">
      <Box style={{ height: '80px', textAlign: 'center', paddingTop: '16px' }} align="center" justify="center">
        <AppHeading level="1">{props.label}</AppHeading>
      </Box>
      <Box style={{ height: 'calc(100% - 160px)', maxWidth: '850px', overflowY: 'auto', width: '100%' }}>
        {styledContent}
      </Box>
      <Box style={{ height: '80px', width: '100%' }}>{children[1]}</Box>
    </Box>
  );
};
