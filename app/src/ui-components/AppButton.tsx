import { ButtonExtendedProps, Button } from 'grommet';

export interface IButton extends ButtonExtendedProps {}

export const AppButton = (props: IButton): JSX.Element => {
  return (
    <>
      <Button {...props} style={{ textTransform: 'uppercase', ...props.style }} />
    </>
  );
};
