import { Box } from 'grommet';
import { AppFormField, AppInput, FieldLabel } from '../../ui-components';
import { SelectedDetails } from '../create/DetailsSelector';
import { PlatformDetails, platforms } from '../../utils/platforms';
import { PlatformId } from '../../types';

export const DetailsForm = (props: { selected?: SelectedDetails }) => {
  const localConstants = {
    marginBottom: '16px',
  };

  return (
    <Box>
      {props.selected?.personal.firstName ? (
        <AppFormField
          name="firstName"
          label={<FieldLabel label="First Name"></FieldLabel>}
          style={{ marginBottom: localConstants.marginBottom }}>
          <AppInput name="firstName" placeholder=""></AppInput>
        </AppFormField>
      ) : (
        <></>
      )}

      {props.selected?.personal.lastName ? (
        <AppFormField
          name="lastName"
          label={<FieldLabel label="Last Name"></FieldLabel>}
          style={{ marginBottom: localConstants.marginBottom }}>
          <AppInput name="lastName" placeholder=""></AppInput>
        </AppFormField>
      ) : (
        <></>
      )}

      {props.selected?.personal.nationalID ? (
        <AppFormField
          name="nationalID"
          label={<FieldLabel label="ID (last 4 digits)"></FieldLabel>}
          style={{ marginBottom: localConstants.marginBottom }}>
          <AppInput name="nationalID" placeholder=""></AppInput>
        </AppFormField>
      ) : (
        <></>
      )}

      {Object.keys(platforms).map((platformId) => {
        const platform = platforms[platformId as PlatformId] as PlatformDetails;

        if (props.selected?.platform[platformId as PlatformId]) {
          return (
            <AppFormField
              name={platformId}
              label={<FieldLabel label={`${platform.name} username`}></FieldLabel>}
              style={{ marginBottom: localConstants.marginBottom }}>
              <AppInput name={platformId} placeholder=""></AppInput>
            </AppFormField>
          );
        }
      })}
    </Box>
  );
};
