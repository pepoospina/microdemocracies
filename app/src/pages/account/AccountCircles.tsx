import { BoxExtendedProps, Text } from 'grommet';

import { AppCard } from '../../ui-components';

interface IAccountChallenge extends BoxExtendedProps {
  cardStyle?: React.CSSProperties;
}

export const AccountCircles = (props: IAccountChallenge) => {
  return (
    <>
      <AppCard style={{ marginTop: '32px', flexShrink: 0 }}>
        <Text>Vouched by Circle (soon)</Text>
      </AppCard>

      <AppCard style={{ marginTop: '32px', flexShrink: 0 }}>
        <Text>Vouched Circle (soon)</Text>
      </AppCard>
    </>
  );
};
