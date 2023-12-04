import { AppForm, AppFormField, AppInput, FieldLabel } from '../../ui-components';
import { PlatformDetails, platforms } from '../../utils/platforms';
import { DetailsAndPlatforms, PersonDetails, PlatformAccount, PlatformId, SelectedDetails } from '../../types';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const formInit = {};

export const DetailsForm = (props: { selected?: SelectedDetails; onChange: (values: DetailsAndPlatforms) => void }) => {
  const { t } = useTranslation();
  const [formValues, setFormValuesState] = useState<any>(formInit);

  useEffect(() => {
    const personDetails: PersonDetails = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      nationalID: formValues.nationalID,
    };

    const userPlatforms: PlatformAccount[] = Object.keys(platforms)
      .map((platformId): PlatformAccount => {
        return { platform: platformId as PlatformId, username: formValues[platformId] };
      })
      .filter((e) => !!e);

    const details: DetailsAndPlatforms = {
      personal: personDetails,
      platforms: userPlatforms,
    };

    props.onChange(details);
  }, [formValues]);

  const localConstants = {
    marginBottom: '16px',
  };

  return (
    <AppForm value={formValues} onChange={setFormValuesState} style={{ height: '100%', width: '100%' }}>
      {props.selected?.personal.firstName ? (
        <AppFormField
          name="firstName"
          label={<FieldLabel label={t('firstName')}></FieldLabel>}
          style={{ marginBottom: localConstants.marginBottom }}>
          <AppInput name="firstName" placeholder=""></AppInput>
        </AppFormField>
      ) : (
        <></>
      )}

      {props.selected?.personal.lastName ? (
        <AppFormField
          name="lastName"
          label={<FieldLabel label={t('lastName')}></FieldLabel>}
          style={{ marginBottom: localConstants.marginBottom }}>
          <AppInput name="lastName" placeholder=""></AppInput>
        </AppFormField>
      ) : (
        <></>
      )}

      {props.selected?.personal.nationalID ? (
        <AppFormField
          name="nationalID"
          label={<FieldLabel label={t('IDNumberLong')}></FieldLabel>}
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
              label={<FieldLabel label={`${platform.name} ${t('username')}`}></FieldLabel>}
              style={{ marginBottom: localConstants.marginBottom }}>
              <AppInput name={platformId} placeholder=""></AppInput>
            </AppFormField>
          );
        }
      })}
    </AppForm>
  );
};
