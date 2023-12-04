import { ButtonExtendedProps, Button, DropButton, DropButtonExtendedProps } from 'grommet';
import { useResponsive, useThemeContext } from '../components/app';

export interface IButton extends ButtonExtendedProps {}

const circleButtonStyle: React.CSSProperties = {
  width: '56px',
  height: '56px',
  padding: '6px',
  border: '2px solid',
  borderRadius: '50%',
  textAlign: 'center',
};

export const AppButton = (props: IButton): JSX.Element => {
  return (
    <>
      <Button {...props} style={{ textTransform: 'uppercase', ...props.style }} />
    </>
  );
};

export const AppCircleButton = (props: IButton) => {
  const { constants } = useThemeContext();
  circleButtonStyle.borderColor = constants.colors.primary;

  return <AppButton {...props} plain label="" style={{ ...props.style, ...circleButtonStyle }}></AppButton>;
};

export const AppButtonResponsive = (props: IButton) => {
  const { mobile } = useResponsive();
  return mobile ? <AppCircleButton {...props}></AppCircleButton> : <AppButton {...props}></AppButton>;
};

export const AppCircleDropButton = (props: DropButtonExtendedProps) => {
  const { constants } = useThemeContext();
  circleButtonStyle.borderColor = constants.colors.primary;

  return <DropButton {...props} plain style={{ ...props.style, ...circleButtonStyle }}></DropButton>;
};

export const AppCircleDropButtonResponsive = (props: DropButtonExtendedProps) => {
  const { mobile } = useResponsive();
  return !mobile ? <DropButton {...props}></DropButton> : <AppCircleDropButton {...props}></AppCircleDropButton>;
};
