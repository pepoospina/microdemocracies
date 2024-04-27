import { Box } from 'grommet'
import { useState } from 'react'

import { PlatformAccount, PlatformId } from '../../shared/types'
import {
  AppButton,
  AppFormField,
  AppInput,
  AppSelect,
  FieldLabel,
  TwoColumns,
} from '../../ui-components'
import { platforms } from '../../utils/platforms'

export interface INetworkSelector {
  onSelected: (user: PlatformAccount) => void
}

export const NetworkSelector = (props: INetworkSelector) => {
  const [platform, setPlatform] = useState<PlatformId>()
  const [username, _setUsername] = useState<string>('')

  const setNetworkSelected = (_network: PlatformId) => {
    setPlatform(_network)
  }

  const setUsername = (_username: string) => {
    _setUsername(_username)
  }

  const addAccount = () => {
    if (!username || !platform) return
    _setUsername('')

    props.onSelected({
      platform,
      username,
    })
  }

  return (
    <Box style={{ flexShrink: 0 }}>
      <TwoColumns gap="12px">
        <Box>
          <AppFormField label={<FieldLabel label="Platform"></FieldLabel>}>
            <AppSelect
              value={
                platform ? (
                  <Box style={{ height: '50px', justifyContent: 'center' }}>
                    {platforms[platform]?.name}
                  </Box>
                ) : (
                  <Box>Select</Box>
                )
              }
              onChange={(e) => setNetworkSelected(e.target.value)}
              options={Object.keys(platforms)}
            >
              {(option: PlatformId) => {
                return <Box style={{ padding: '8px 12px' }}>{platforms[option]?.name}</Box>
              }}
            </AppSelect>
          </AppFormField>
        </Box>
        <Box>
          <AppFormField label={<FieldLabel label="Username"></FieldLabel>}>
            <AppInput
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            ></AppInput>
          </AppFormField>
        </Box>
      </TwoColumns>
      <Box style={{ width: '100%' }} align="center">
        <AppButton
          label="ADD"
          primary
          style={{ width: '200px' }}
          onClick={() => addAccount()}
          disabled={!username || !platform}
        ></AppButton>
      </Box>
    </Box>
  )
}
