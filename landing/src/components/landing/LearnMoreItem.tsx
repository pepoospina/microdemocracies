import { Box, Text } from 'grommet';
import { BoxCentered } from '../../@app/ui-components/BoxCentered';
import { useResponsive } from '../../@app/components/app/ResponsiveApp';

export const LearnMoreItem = (props: {
  mainText: React.ReactNode;
  secondaryText: React.ReactNode;
}) => {
  const { mobile } = useResponsive();
  const fontSizeLarge = mobile ? '28px' : '36px';
  const fontSizeSmall = mobile ? '18px' : '24px';
  return (
    <Box>
      <BoxCentered style={{ height: '30vh' }}>
        <Text
          style={{
            fontSize: fontSizeLarge,
            lineHeight: '150%',
            fontWeight: '300',
          }}>
          {props.mainText}
        </Text>
      </BoxCentered>
      <Box style={{ marginTop: '24px' }}>
        <Text
          style={{
            fontSize: fontSizeSmall,
            lineHeight: '150%',
            fontWeight: '300',
          }}>
          {props.secondaryText}
        </Text>
      </Box>
    </Box>
  );
};
