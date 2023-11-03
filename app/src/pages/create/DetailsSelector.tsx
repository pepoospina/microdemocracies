import { Box, Text } from 'grommet';
import { StatusGood } from 'grommet-icons';
import { AppButton } from '../../ui-components';
import { useThemeContext } from '../../components/app';
import { useState } from 'react';
import { PlatformDetails, platforms } from '../../utils/platforms';
import { PlatformId } from '../../types';

interface SelectedDetails {
  personal: {
    firstName: boolean;
    lastName: boolean;
    placeOfBirth: boolean;
    dateOfBirth: boolean;
    nationality: boolean;
    nationalID: boolean;
    organization: boolean;
  };
  platform: Record<PlatformId, boolean>;
}

const detailsInit: SelectedDetails = {
  personal: {
    firstName: false,
    lastName: false,
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
};

enum Options {
  NameAndLastame = 'NameAndLastame',
  SocialAccount = 'SocialAccount',
  IDNumber = 'IDNumber',
}

export const DetailsSelector = () => {
  const { constants } = useThemeContext();

  const [details, setDetails] = useState<SelectedDetails>(detailsInit);
  const [showSelectPlatform, setShowSelectPlatform] = useState<boolean>(false);

  const nameAndLastname = details.personal.firstName && details.personal.lastName;
  const platformSelected = Object.keys(details.platform).reduce((selected: boolean, platformId) => {
    return details.platform[platformId as PlatformId] || selected;
  }, false);

  const platformsSelected = Object.keys(details.platform).reduce((selected: string[], platformId) => {
    if (details.platform[platformId as PlatformId]) {
      selected.push((platforms[platformId as PlatformId] as PlatformDetails).name);
    }
    return selected;
  }, []);
  const platformsSelectedText = platformsSelected.length ? platformsSelected.join(' and ') : 'Social';

  const select = (option: Options) => {
    if (option === Options.NameAndLastame) {
      if (nameAndLastname) {
        details.personal.firstName = false;
        details.personal.lastName = false;
      } else {
        details.personal.firstName = true;
        details.personal.lastName = true;
      }
    }

    if (option === Options.IDNumber) {
      if (details.personal.nationalID) {
        if (!details.personal.lastName) details.personal.firstName = false;
        details.personal.nationalID = !details.personal.nationalID;
      } else {
        if (details.personal.lastName) details.personal.firstName = true;
        details.personal.nationalID = !details.personal.nationalID;
      }
    }

    setDetails({ ...details });
  };

  const togglePlatform = (platformId: PlatformId) => {
    details.platform[platformId] = !details.platform[platformId];
    setDetails({ ...details });
  };

  return (
    <>
      <Box style={{ marginBottom: '12px', fontSize: '10px', fontWeight: '300' }}>
        <Text>Participants will be asked to provide:</Text>
      </Box>

      <Box direction="row" align="center" style={{ marginBottom: '12px' }}>
        <Box style={{ flexGrow: 1 }}>
          <AppButton
            primary={nameAndLastname}
            label="Name and Lastname"
            onClick={() => select(Options.NameAndLastame)}></AppButton>
        </Box>
        <Box justify="center" style={{ marginLeft: '12px', width: '40px', height: '40px' }}>
          {nameAndLastname ? <StatusGood color={constants.colors.primary} size={'40px'}></StatusGood> : <></>}
        </Box>
      </Box>

      <Box direction="row" align="center" style={{ marginBottom: '12px' }}>
        <Box style={{ flexGrow: 1 }}>
          <AppButton
            primary={platformSelected}
            label={
              showSelectPlatform
                ? 'Hide List'
                : `${platformsSelectedText} Account${platformsSelected.length > 1 ? 's' : ''}`
            }
            onClick={() => setShowSelectPlatform(!showSelectPlatform)}></AppButton>
        </Box>
        <Box justify="center" style={{ marginLeft: '12px', width: '40px', height: '40px' }}>
          {platformSelected ? <StatusGood color={constants.colors.primary} size={'40px'}></StatusGood> : <></>}
        </Box>
      </Box>
      <Box>
        {showSelectPlatform ? (
          <>
            <Box style={{ margin: '22px 0px 8px 0px', fontSize: '10px', fontWeight: '300' }}>
              <Text>Chose the platform(s) account(s) that will be asked to participants.</Text>
            </Box>
            <Box style={{ marginBottom: '32px' }}>
              {Object.keys(platforms).map((platformID) => {
                return (
                  <Box id={platformID}>
                    <AppButton
                      primary={details.platform[platformID as PlatformId]}
                      label={(platforms[platformID as PlatformId] as PlatformDetails).name}
                      onClick={() => togglePlatform(platformID as PlatformId)}></AppButton>
                  </Box>
                );
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
            label="ID Number (Last 4 digits)"
            onClick={() => select(Options.IDNumber)}></AppButton>
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
  );
};
