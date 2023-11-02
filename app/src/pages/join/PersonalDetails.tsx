import { useState, useCallback } from 'react';

import { AppForm, AppFormField, FieldLabel, AppInput } from '../../ui-components';
import { PersonDetails } from '../../types';
import { Box } from 'grommet';

export interface IPersonalDetails {
  onChange: (personal: PersonDetails) => any;
}

export const AppPersonalDetails = (props: IPersonalDetails) => {
  const [formValues, setFormValuesState] = useState<PersonDetails>({});

  const onValuesUpdated = useCallback((values: PersonDetails) => {
    setFormValuesState(values);
    props.onChange(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const localConstants = {
    marginBottom: '16px',
  };

  return (
    <Box pad="large">
      <AppForm value={formValues} onChange={onValuesUpdated as any} style={{ height: '100%', width: '100%' }}>
        <AppFormField
          name="firstName"
          label={<FieldLabel label="First Name"></FieldLabel>}
          style={{ marginBottom: localConstants.marginBottom }}>
          <AppInput name="firstName" placeholder=""></AppInput>
        </AppFormField>
        <AppFormField
          name="lastName"
          label={<FieldLabel label="Last Name"></FieldLabel>}
          style={{ marginBottom: localConstants.marginBottom }}>
          <AppInput name="lastName" placeholder=""></AppInput>
        </AppFormField>
        <AppFormField
          name="placeOfBirth"
          label={<FieldLabel label="Place of Birth"></FieldLabel>}
          style={{ marginBottom: localConstants.marginBottom }}>
          <AppInput name="placeOfBirth" placeholder=""></AppInput>
        </AppFormField>
        <AppFormField
          name="dateOfBirth"
          label={<FieldLabel label="Date of Birth"></FieldLabel>}
          style={{ marginBottom: localConstants.marginBottom }}>
          <AppInput name="dateOfBirth" placeholder=""></AppInput>
        </AppFormField>
        <AppFormField
          name="nationality"
          label={<FieldLabel label="Nationality"></FieldLabel>}
          style={{ marginBottom: localConstants.marginBottom }}>
          <AppInput name="nationality" placeholder=""></AppInput>
        </AppFormField>
        <AppFormField
          name="nationalID"
          label={<FieldLabel label="National ID number (last 4 digits)"></FieldLabel>}
          style={{ marginBottom: localConstants.marginBottom }}>
          <AppInput name="nationalID" placeholder=""></AppInput>
        </AppFormField>
        <AppFormField
          name="dateOfBirth"
          label={<FieldLabel label="Date of Birth"></FieldLabel>}
          style={{ marginBottom: localConstants.marginBottom }}>
          <AppInput name="dateOfBirth" placeholder=""></AppInput>
        </AppFormField>
        <AppFormField
          name="organization"
          label={<FieldLabel label="Current Organization"></FieldLabel>}
          style={{ marginBottom: localConstants.marginBottom }}>
          <AppInput name="organization" placeholder=""></AppInput>
        </AppFormField>
      </AppForm>
    </Box>
  );
};
