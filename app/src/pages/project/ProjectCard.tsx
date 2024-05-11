import { Box, Text } from 'grommet'
import { useTranslation } from 'react-i18next'

import { useThemeContext } from '../../components/app'
import { I18Keys } from '../../i18n/kyel.list'
import { AppProject } from '../../shared/types'
import { StatementEditable } from '../voice/StatementEditable'

export const ProjectCard = (props: {
  project: AppProject
  containerStyle?: React.CSSProperties
  statementStyle?: React.CSSProperties
}) => {
  const { constants } = useThemeContext()
  const { t } = useTranslation()

  return (
    <Box style={{ position: 'relative', ...props.containerStyle }}>
      <Box style={{ position: 'absolute', left: '12px', top: '4px' }}>
        <Text
          color={constants.colors.textOnPrimary}
          style={{ fontSize: '14px' }}
          weight="bold"
        >
          {t(I18Keys.anyoneWho)}...
        </Text>
      </Box>
      <StatementEditable
        value={props.project.whoStatement}
        containerStyle={{ paddingTop: '22px', ...props.statementStyle }}
      ></StatementEditable>
    </Box>
  )
}
