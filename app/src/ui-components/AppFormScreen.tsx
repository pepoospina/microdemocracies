import { BoxExtendedProps, Box } from 'grommet';
import { FormPrevious, FormNext } from 'grommet-icons';
import { AppButton } from './AppButton';
import { AppHeading } from './AppHeading';
import React, { ReactElement } from 'react';
import { AppCard } from './AppCard';

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

export interface IButtonWithAction {
  label?: string;
  action?: () => void;
  primary?: boolean;
  disabled?: boolean;
  icon?: ReactElement;
}

export const BottomButtons = (props: { left?: IButtonWithAction; right?: IButtonWithAction; popUp?: string }) => {
  const { left, right } = props;
  const style = { flexGrow: '1', maxWidth: '300px' };
  return (
    <Box direction="row" justify="evenly" style={{ position: 'relative' }}>
      {left ? (
        <AppButton
          icon={!left.icon ? <FormPrevious /> : left.icon}
          style={style}
          onClick={left.action}
          label={left.label}
          primary={left.primary}
          disabled={left.disabled}></AppButton>
      ) : (
        <></>
      )}
      {right ? (
        <AppButton
          reverse
          icon={!right.icon ? <FormNext /> : right.icon}
          style={style}
          onClick={right.action}
          label={right.label}
          primary={right.primary}
          disabled={right.disabled}></AppButton>
      ) : (
        <></>
      )}
      {props.popUp !== undefined ? (
        <AppCard style={{ position: 'absolute', right: '20px', top: '-120px', width: '360px' }}>{props.popUp}</AppCard>
      ) : (
        <></>
      )}
    </Box>
  );
};
