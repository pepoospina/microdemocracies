import { Box, Text } from 'grommet';
import { BoxCentered } from '../../ui-components/BoxCentered';

export const LearnMoreItem = (props: { mainText: React.ReactNode; secondaryText: React.ReactNode }) => {
  return (
    <Box>
      <BoxCentered style={{ height: '30vh' }}>
        <Text style={{ fontSize: '28px', lineHeight: '150%', fontWeight: '300' }}>{props.mainText}</Text>
      </BoxCentered>
      <Box style={{ marginTop: '24px' }}>
        <Text style={{ fontSize: '18px', lineHeight: '150%', fontWeight: '300' }}>{props.secondaryText}</Text>
      </Box>
    </Box>
  );
};
