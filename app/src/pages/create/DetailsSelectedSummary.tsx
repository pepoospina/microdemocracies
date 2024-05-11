import { Box, Text } from 'grommet'
import { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'

import { I18Keys } from '../../i18n/kyel.list'
import { PlatformId, SelectedDetails } from '../../shared/types'
import { AppTag } from '../../ui-components'
import { PlatformDetails, platforms } from '../../utils/platforms'

export const DetailsSelectedSummary = (props: { selected?: SelectedDetails }) => {
  const { t } = useTranslation()

  const textStyle: CSSProperties = {
    fontSize: '14px',
    fontWeight: '500',
  }

  const tagStyle: CSSProperties = {
    marginRight: '8px',
  }

  return (
    <Box direction="row">
      {props.selected?.personal.firstName ? (
        <AppTag style={tagStyle}>
          <Text style={textStyle}>{t([I18Keys.firstName])}</Text>
        </AppTag>
      ) : (
        <></>
      )}
      {props.selected?.personal.lastName ? (
        <AppTag style={tagStyle}>
          <Text style={textStyle}>{t([I18Keys.lastName])}</Text>
        </AppTag>
      ) : (
        <></>
      )}

      {props.selected?.personal.nationalID ? (
        <AppTag style={tagStyle}>
          <Text style={textStyle}>{t([I18Keys.IDNumberLong])}</Text>
        </AppTag>
      ) : (
        <></>
      )}

      {Object.keys(platforms).map((platformId) => {
        if (props.selected?.platform[platformId as PlatformId]) {
          return (
            <AppTag style={tagStyle}>
              <Text style={textStyle}>
                {(platforms[platformId as PlatformId] as PlatformDetails).name}
              </Text>
            </AppTag>
          )
        }
      })}
    </Box>
  )
}
