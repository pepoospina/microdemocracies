import { Box } from 'grommet'
import { FormNext, FormPrevious } from 'grommet-icons'
import { ReactElement } from 'react'

import { AppButton, AppCard, IButton } from '../../ui-components'

export const AppBottomButton = (props: IButton) => {
  return (
    <Box style={{ width: '100%' }} pad="small" align="center">
      <AppButton {...props} style={{ width: '100%' }}></AppButton>
    </Box>
  )
}

export interface IButtonWithAction {
  label?: string
  action?: () => void
  primary?: boolean
  disabled?: boolean
  icon?: ReactElement
}

export const AppBottomButtons = (props: {
  left?: IButtonWithAction
  right?: IButtonWithAction
  popUp?: string
}) => {
  const { left, right } = props
  const style = { flexGrow: '1', maxWidth: '300px', width: '50%' }
  return (
    <Box
      direction="row"
      justify="evenly"
      style={{ position: 'relative' }}
      gap="small"
      pad="small"
    >
      {left ? (
        <AppButton
          icon={!left.icon ? <FormPrevious /> : left.icon}
          style={style}
          onClick={left.action}
          label={left.label}
          primary={left.primary}
          disabled={left.disabled}
        ></AppButton>
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
          disabled={right.disabled}
        ></AppButton>
      ) : (
        <></>
      )}
    </Box>
  )
}
