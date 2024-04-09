import { Box, Spinner, Text } from 'grommet'
import { Favorite } from 'grommet-icons'

import { CircleIndicator } from '../../components/app/CircleIndicator'
import { useStatementContext } from '../../contexts/StatementContext'
import { AppButton } from '../../ui-components/AppButton'
import { IStatementEditable, StatementEditable } from './StatementEditable'

export const StatementCard = (props: {
  containerStyle?: React.CSSProperties
  statmentCardProps?: IStatementEditable
}) => {
  const { statement, nBacking, canBack, back, alreadyBacked } = useStatementContext()

  return (
    <Box style={{ position: 'relative', flexShrink: 0, ...props.containerStyle }}>
      <StatementEditable
        {...props.statmentCardProps}
        value={statement?.statement}
        containerStyle={{ paddingBottom: '22px' }}
      ></StatementEditable>
      <Box
        direction="row"
        justify="end"
        gap="small"
        align="center"
        pad={{ horizontal: 'medium' }}
        style={{
          position: 'absolute',
          bottom: '-12px',
          left: '0px',
          width: '100%',
        }}
      >
        <CircleIndicator
          borderWidth="4px"
          icon={
            <Box>
              <Text color="white">
                {nBacking !== undefined ? (
                  <b>{nBacking}</b>
                ) : (
                  <Spinner color="white"></Spinner>
                )}
              </Text>
            </Box>
          }
        ></CircleIndicator>
        <AppButton plain onClick={() => back()} disabled={!canBack}>
          <CircleIndicator
            size={48}
            icon={
              nBacking === undefined ? (
                <Spinner color="white"></Spinner>
              ) : (
                <Favorite color="white" style={{ height: '20px' }} />
              )
            }
          ></CircleIndicator>
        </AppButton>

        {alreadyBacked ? (
          <Box style={{ position: 'absolute', bottom: '48px' }}>
            <Text color="white">already backed!</Text>
          </Box>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  )
}
