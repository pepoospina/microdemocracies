import { Box, BoxExtendedProps, Text } from 'grommet'
import { AppCard } from '../../ui-components'

export const Intro = (props: BoxExtendedProps) => {
  return (
    <Box pad="large" {...props}>
      <AppCard margin={{ bottom: 'medium' }}>
        <Text>Each person in the registry is a real person.</Text>
      </AppCard>

      <AppCard margin={{ bottom: 'medium' }}>
        <Text>You will be asked to provide the account you want to register and some personal details.</Text>
      </AppCard>

      <AppCard margin={{ bottom: 'medium' }}>
        <Text>
          <b>All personal details are optional.</b> It's up to you to decide ones you provide. These should be
          considered enough for your voucher to vouch for you.
        </Text>
      </AppCard>
    </Box>
  )
}
