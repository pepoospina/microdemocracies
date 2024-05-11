import { Box, BoxExtendedProps, Spinner, Text } from 'grommet'
import React, { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'

import { I18Keys } from '../../i18n/kyel.list'
import { HexStr, PAP } from '../../shared/types'
import { cap } from '../../utils/general'
import { platforms } from '../../utils/platforms'
import { AccountAddress } from './AccountAddress'
import { PlatformUrl } from './PlatformUrl'

interface IAccountPerson extends BoxExtendedProps {
  pap?: PAP
  cardStyle?: React.CSSProperties
  showAccount?: boolean
}

interface IDetailField {
  field?: { label: string; value?: string | React.ReactNode }
  boxStyle?: CSSProperties
}

export const DetailField = (props: IDetailField) => {
  if (props.field && props.field.value) {
    return (
      <Box style={{ ...props.boxStyle }}>
        <Box style={{ margin: '0px' }}>
          <Text>
            <b>{props.field.label}:</b>
          </Text>
        </Box>
        <Box>
          <Text> {props.field.value}</Text>
        </Box>
      </Box>
    )
  }

  return <></>
}

export const AccountPerson = (props: IAccountPerson) => {
  const { t } = useTranslation()

  const fieldStyle: CSSProperties = {
    margin: '8px 0px 0px 0px',
  }

  return props.pap ? (
    <Box style={{ width: '100%', flexShrink: 0, ...props.cardStyle }}>
      <Box>
        <DetailField
          boxStyle={fieldStyle}
          field={{
            label: t([I18Keys.firstName]),
            value: props.pap.person?.personal?.firstName,
          }}
        ></DetailField>
        <DetailField
          boxStyle={fieldStyle}
          field={{
            label: t([I18Keys.lastName]),
            value: props.pap.person?.personal?.lastName,
          }}
        ></DetailField>
        <DetailField
          boxStyle={fieldStyle}
          field={{
            label: 'Place of Birth',
            value: props.pap.person?.personal?.placeOfBirth,
          }}
        ></DetailField>
        <DetailField
          boxStyle={fieldStyle}
          field={{ label: 'Date of Birth', value: props.pap.person?.personal?.dateOfBirth }}
        ></DetailField>
        <DetailField
          boxStyle={fieldStyle}
          field={{ label: 'Nationality', value: props.pap.person?.personal?.nationality }}
        ></DetailField>
        <DetailField
          boxStyle={fieldStyle}
          field={{
            label: t([I18Keys.IDNumberLong]),
            value: props.pap.person?.personal?.nationalID,
          }}
        ></DetailField>
        <DetailField
          boxStyle={fieldStyle}
          field={{ label: 'Organization', value: props.pap.person?.personal?.organization }}
        ></DetailField>
      </Box>
      <Box>
        {props.pap.person?.platforms?.map((user, ix) => {
          if (!user.platform || !user.username) return <Box key={ix}></Box>
          const platform = platforms[user.platform]
          const platformName = platform ? platform.name : 'custom'
          const field = { label: platformName, value: <PlatformUrl user={user} /> }
          return <DetailField key={ix} boxStyle={fieldStyle} field={field} />
        })}
      </Box>
      <Box style={fieldStyle}>
        <Text style={{ fontWeight: 'bold' }}>{cap(t([I18Keys.account]))}:</Text>
        <AccountAddress
          showAccount={props.showAccount}
          account={props.pap.account as HexStr}
        ></AccountAddress>
      </Box>
    </Box>
  ) : (
    <Spinner></Spinner>
  )
}
