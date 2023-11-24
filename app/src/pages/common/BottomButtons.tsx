import { Box } from 'grommet';
import { AppButton, AppCard, IButton } from '../../ui-components';
import { useResponsive } from '../../components/app';
import { ReactElement } from 'react';
import { FormPrevious, FormNext } from 'grommet-icons';

export const AppBottomButton = (props: IButton) => {
  const { vw } = useResponsive();
  const maxWidth = vw < 500 ? 'auto' : '200px';
  const marginLeft = vw < 500 ? '0px' : '3vw';

  return (
    <Box style={{ maxWidth, marginLeft }}>
      <AppButton {...props}></AppButton>
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

export const AppBottomButtons = (props: { left?: IButtonWithAction; right?: IButtonWithAction; popUp?: string }) => {
  const { left, right } = props;
  const style = { flexGrow: '1', maxWidth: '300px', width: '50%' };
  return (
    <Box direction="row" justify="evenly" style={{ position: 'relative' }} gap="small" pad="small">
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
