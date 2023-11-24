import React, { CSSProperties } from 'react';
import { Box, BoxExtendedProps, Spinner, Text } from 'grommet';

import { HexStr, PAP } from '../../types';
import { Address } from '../../ui-components';
import { PlatformUrl } from './PlatformUrl';
import { CHAIN_ID } from '../../config/appConfig';
import { platforms } from '../../utils/platforms';

interface IAccountPerson extends BoxExtendedProps {
  pap?: PAP;
  cardStyle?: React.CSSProperties;
}

interface IDetailField {
  field?: { label: string; value?: string | React.ReactNode };
  boxStyle?: CSSProperties;
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
    );
  }

  return <></>;
};

export const AccountPerson = (props: IAccountPerson) => {
  const fieldStyle: CSSProperties = {
    margin: '8px 0px 0px 0px',
  };

  return props.pap ? (
    <Box style={{ width: '100%', ...props.cardStyle }}>
      <Box>
        <DetailField
          boxStyle={fieldStyle}
          field={{ label: 'First Name', value: props.pap.person?.personal?.firstName }}></DetailField>
        <DetailField
          boxStyle={fieldStyle}
          field={{ label: 'Last Name', value: props.pap.person?.personal?.lastName }}></DetailField>
        <DetailField
          boxStyle={fieldStyle}
          field={{ label: 'Place of Birth', value: props.pap.person?.personal?.placeOfBirth }}></DetailField>
        <DetailField
          boxStyle={fieldStyle}
          field={{ label: 'Date of Birth', value: props.pap.person?.personal?.dateOfBirth }}></DetailField>
        <DetailField
          boxStyle={fieldStyle}
          field={{ label: 'Nationality', value: props.pap.person?.personal?.nationality }}></DetailField>
        <DetailField
          boxStyle={fieldStyle}
          field={{ label: 'National ID (last 4 digits)', value: props.pap.person?.personal?.nationalID }}></DetailField>
        <DetailField
          boxStyle={fieldStyle}
          field={{ label: 'Organization', value: props.pap.person?.personal?.organization }}></DetailField>
      </Box>
      <Box align="center">
        {props.pap.person?.platforms?.map((user) => {
          if (!user.platform || !user.username) return <></>;
          const platform = platforms[user.platform];
          const platformName = platform ? platform.name : 'custom';
          const field = { label: platformName, value: <PlatformUrl user={user} /> };
          return <DetailField key={JSON.stringify(user)} boxStyle={fieldStyle} field={field} />;
        })}
      </Box>
      <Box style={fieldStyle}>
        <Text style={{ fontWeight: 'bold' }}>Account:</Text>
        <Address digits={8} address={props.pap.account as HexStr} chainId={CHAIN_ID}></Address>
      </Box>
    </Box>
  ) : (
    <Spinner></Spinner>
  );
};
