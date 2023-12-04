import { Box, Text } from 'grommet';
import { PlatformDetails, platforms } from '../../utils/platforms';
import { PlatformId, SelectedDetails } from '../../types';
import { AppTag } from '../../ui-components';
import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';

export const DetailsSelectedSummary = (props: { selected?: SelectedDetails }) => {
  const { t } = useTranslation();

  const textStyle: CSSProperties = {
    fontSize: '14px',
    fontWeight: '500',
  };

  const tagStyle: CSSProperties = {
    marginRight: '8px',
  };

  return (
    <Box direction="row">
      {props.selected?.personal.firstName ? (
        <AppTag style={tagStyle}>
          <Text style={textStyle}>{t('firstName')}</Text>
        </AppTag>
      ) : (
        <></>
      )}
      {props.selected?.personal.lastName ? (
        <AppTag style={tagStyle}>
          <Text style={textStyle}>{t('lastName')}</Text>
        </AppTag>
      ) : (
        <></>
      )}

      {props.selected?.personal.nationalID ? (
        <AppTag style={tagStyle}>
          <Text style={textStyle}>{t('IDNumberLong')}</Text>
        </AppTag>
      ) : (
        <></>
      )}

      {Object.keys(platforms).map((platformId) => {
        if (props.selected?.platform[platformId as PlatformId]) {
          return (
            <AppTag style={tagStyle}>
              <Text style={textStyle}>{(platforms[platformId as PlatformId] as PlatformDetails).name}</Text>
            </AppTag>
          );
        }
      })}
    </Box>
  );
};
