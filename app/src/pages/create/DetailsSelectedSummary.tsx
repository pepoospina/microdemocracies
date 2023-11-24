import { Box, Text } from 'grommet';
import { PlatformDetails, platforms } from '../../utils/platforms';
import { PlatformId, SelectedDetails } from '../../types';
import { AppTag } from '../../ui-components';
import { CSSProperties } from 'react';

export const DetailsSelectedSummary = (props: { selected?: SelectedDetails }) => {
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
          <Text style={textStyle}>First Name</Text>
        </AppTag>
      ) : (
        <></>
      )}
      {props.selected?.personal.lastName ? (
        <AppTag style={tagStyle}>
          <Text style={textStyle}>Last Name</Text>
        </AppTag>
      ) : (
        <></>
      )}

      {props.selected?.personal.nationalID ? (
        <AppTag style={tagStyle}>
          <Text style={textStyle}>National ID (last 4 digits)</Text>
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
