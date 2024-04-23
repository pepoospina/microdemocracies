import { Box, Text } from 'grommet'
import { StatusGood } from 'grommet-icons'
import { t } from 'i18next'
import { useEffect, useState } from 'react'

import { useResponsive, useThemeContext } from '../../components/app'
import { PlatformId, SelectedDetails } from '../../types'
import { AppButton, AppHeading } from '../../ui-components'
import { cap } from '../../utils/general'
import { PlatformDetails, platforms } from '../../utils/platforms'

const detailsInit: SelectedDetails = {
  personal: {
    firstName: true,
    lastName: true,
    placeOfBirth: false,
    dateOfBirth: false,
    nationality: false,
    nationalID: false,
    organization: false,
  },
  platform: {
    [PlatformId.X]: false,
    [PlatformId.Telegram]: false,
    [PlatformId.Whatsapp]: false,
    [PlatformId.Mobile]: false,
    [PlatformId.Instagram]: false,
    [PlatformId.Facebook]: false,
    [PlatformId.Email]: false,
    [PlatformId.Discord]: false,
    [PlatformId.Custom]: false,
  },
}

enum Options {
  NameAndLastame = 'NameAndLastame',
  SocialAccount = 'SocialAccount',
  IDNumber = 'IDNumber',
}

export const DetailsSelector = (props: {
  onChanged: (seleted: SelectedDetails) => void
}) => {
  const { constants } = useThemeContext()
  const { mobile } = useResponsive()

  const [details, setDetails] = useState<SelectedDetails>(detailsInit)
  const [showSelectPlatform, setShowSelectPlatform] = useState<boolean>(false)

  const nameAndLastname = details.personal.firstName && details.personal.lastName
  const platformSelected = Object.keys(details.platform).reduce(
    (selected: boolean, platformId) => {
      return details.platform[platformId as PlatformId] || selected
    },
    false,
  )

  const platformsSelected = Object.keys(details.platform).reduce(
    (selected: string[], platformId) => {
      if (details.platform[platformId as PlatformId]) {
        selected.push((platforms[platformId as PlatformId] as PlatformDetails).name)
      }
      return selected
    },
    [],
  )
  const platformsSelectedText = platformsSelected.length
    ? platformsSelected.join(` ${t('and')} `)
    : t('social')

  useEffect(() => {
    if (props.onChanged) {
      props.onChanged(details)
    }
  }, [details, props.onChanged])

  const select = (option: Options) => {
    if (option === Options.NameAndLastame) {
      if (nameAndLastname) {
        details.personal.firstName = false
        details.personal.lastName = false
      } else {
        details.personal.firstName = true
        details.personal.lastName = true
      }
    }

    if (option === Options.IDNumber) {
      if (details.personal.nationalID) {
        if (!details.personal.lastName) details.personal.firstName = false
        details.personal.nationalID = !details.personal.nationalID
      } else {
        if (details.personal.lastName) details.personal.firstName = true
        details.personal.nationalID = !details.personal.nationalID
      }
    }

    setDetails({ ...details })
  }

  const togglePlatform = (platformId: PlatformId) => {
    details.platform[platformId] = !details.platform[platformId]
    setDetails({ ...details })
    setShowSelectPlatform(false)
  }

  const idNumberStr = mobile ? t('IDNumber') : t('IDNumberLong')

  return (
    <>
      <Box style={{ marginBottom: '12px', fontSize: '10px', fontWeight: '300' }}>
        <Text style={{ margin: '12px 0px 0px 0px' }}>{t('selectMsgOpts')}.</Text>
      </Box>

      <Box direction="row" align="center" style={{ marginBottom: '12px' }}>
        <Box style={{ flexGrow: 1 }}>
          <AppButton
            primary={nameAndLastname}
            label={t('nameAndLastName')}
            onClick={() => select(Options.NameAndLastame)}
          ></AppButton>
        </Box>
        <Box justify="center" style={{ marginLeft: '12px', width: '40px', height: '40px' }}>
          {nameAndLastname ? (
            <StatusGood color={constants.colors.primary} size={'40px'}></StatusGood>
          ) : (
            <></>
          )}
        </Box>
      </Box>

      <Box direction="row" align="center" style={{ marginBottom: '12px' }}>
        <Box style={{ flexGrow: 1 }}>
          <AppButton
            primary={platformSelected}
            label={showSelectPlatform ? t('hideList') : `${platformsSelectedText}`}
            onClick={() => setShowSelectPlatform(!showSelectPlatform)}
          ></AppButton>
        </Box>
        <Box justify="center" style={{ marginLeft: '12px', width: '40px', height: '40px' }}>
          {platformSelected ? (
            <StatusGood color={constants.colors.primary} size={'40px'}></StatusGood>
          ) : (
            <></>
          )}
        </Box>
      </Box>
      <Box>
        {showSelectPlatform ? (
          <>
            <Box
              style={{ margin: '22px 0px 8px 0px', fontSize: '10px', fontWeight: '300' }}
            >
              <Text>{t('choosePlatformsMsg')}.</Text>
            </Box>
            <Box style={{ marginBottom: '32px' }}>
              {Object.keys(platforms).map((platformID) => {
                return (
                  <Box id={platformID}>
                    <AppButton
                      primary={details.platform[platformID as PlatformId]}
                      label={(platforms[platformID as PlatformId] as PlatformDetails).name}
                      onClick={() => togglePlatform(platformID as PlatformId)}
                    ></AppButton>
                  </Box>
                )
              })}
            </Box>
          </>
        ) : (
          <></>
        )}
      </Box>

      <Box direction="row" align="center">
        <Box style={{ flexGrow: 1 }}>
          <AppButton
            primary={details.personal.nationalID}
            label={idNumberStr}
            onClick={() => select(Options.IDNumber)}
          ></AppButton>
        </Box>
        <Box justify="center" style={{ marginLeft: '12px', width: '40px', height: '40px' }}>
          {details.personal.nationalID ? (
            <StatusGood color={constants.colors.primary} size={'40px'}></StatusGood>
          ) : (
            <></>
          )}
        </Box>
      </Box>
    </>
  )
}
