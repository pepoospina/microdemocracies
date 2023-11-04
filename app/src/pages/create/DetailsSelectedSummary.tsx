import { Box, Text } from 'grommet';
import { SelectedDetails } from './DetailsSelector';
import { PlatformDetails, platforms } from '../../utils/platforms';
import { PlatformId } from '../../types';

export const DetailsSelectedSummary = (props: { selected?: SelectedDetails }) => {
  return (
    <Box>
      {props.selected?.personal.firstName ? <Text>First Name</Text> : <></>}
      {props.selected?.personal.lastName ? <Text>Last Name</Text> : <></>}
      {props.selected?.personal.nationalID ? <Text>National ID (last 4 digits)</Text> : <></>}
      {Object.keys(platforms).map((platformId) => {
        if (props.selected?.platform[platformId as PlatformId]) {
          return <Text>{(platforms[platformId as PlatformId] as PlatformDetails).name}</Text>;
        }
      })}
    </Box>
  );
};
