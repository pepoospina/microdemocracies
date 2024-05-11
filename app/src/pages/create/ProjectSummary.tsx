import { Box, Text } from 'grommet'
import { useTranslation } from 'react-i18next'

import { I18Keys } from '../../i18n/kyel.list'
import { PAP, SelectedDetails } from '../../shared/types'
import { AppCard, AppHeading } from '../../ui-components'
import { AccountPerson } from '../account/AccountPerson'
import { StatementEditable } from '../voice/StatementEditable'
import { DetailsSelectedSummary } from './DetailsSelectedSummary'

export const ProjectSummary = (props: {
  whatStatement?: string
  whoStatement?: string
  selectedDetails?: SelectedDetails
  founderPap?: PAP
}) => {
  const { t } = useTranslation()

  return (
    <Box>
      <Box style={{ width: '100%', flexShrink: 0 }}>
        {props.whoStatement ? (
          <>
            <Box
              style={{
                margin: '24px 0 12px 0',
                fontSize: '10px',
                fontWeight: '300',
                flexShrink: 0,
              }}
            >
              <AppHeading level="3">{t([I18Keys.canJoin])}:</AppHeading>
            </Box>
            <Box>
              <StatementEditable value={props.whoStatement}></StatementEditable>
            </Box>
          </>
        ) : (
          <>
            <AppCard>
              <Text>{t([I18Keys.notWhoGiven])}.</Text>
            </AppCard>
          </>
        )}
      </Box>

      <Box style={{ marginTop: '36px', flexShrink: 0 }}>
        <AppHeading level="3" style={{ marginBottom: '12px' }}>
          {t([I18Keys.toJoinMsg2])}:
        </AppHeading>
        <DetailsSelectedSummary selected={props.selectedDetails}></DetailsSelectedSummary>
      </Box>

      <Box style={{ marginTop: '36px', flexShrink: 0 }}>
        <AppHeading level="3">{t([I18Keys.yourDetails])}:</AppHeading>
        <AccountPerson
          cardStyle={{ margin: '16px 0px 32px 0px' }}
          pap={props.founderPap}
        ></AccountPerson>
      </Box>
    </Box>
  )
}
