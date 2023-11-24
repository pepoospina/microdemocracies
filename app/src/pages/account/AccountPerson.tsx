import React from 'react';
import { Box, BoxExtendedProps, ResponsiveContext, Spinner, Text } from 'grommet';

import { HexStr, PAP } from '../../types';
import { Address, TwoColumns } from '../../ui-components';
import { PlatformUrl } from './PlatformUrl';
import { CHAIN_ID } from '../../config/appConfig';
import { BoxCentered } from '../../ui-components/BoxCentered';
import { platforms } from '../../utils/platforms';

interface IAccountPerson extends BoxExtendedProps {
  pap?: PAP;
  cardStyle?: React.CSSProperties;
}

interface IDetailField {
  field?: { label: string; value?: string | React.ReactNode };
}

export const DetailField = (props: IDetailField) => {
  const size = React.useContext(ResponsiveContext);

  const textAlign = ['xsmall', 'small'].includes(size) ? 'left' : 'right';

  if (props.field && props.field.value) {
    return (
      <TwoColumns style={{ margin: '6px 0px' }}>
        <Box style={{ textAlign, margin: '0 8px 6px 0' }}>
          <b>{props.field.label}:</b>
        </Box>
        <Box> {props.field.value}</Box>
      </TwoColumns>
    );
  }

  return <></>;
};

export const AccountPerson = (props: IAccountPerson) => {
  return props.pap ? (
    <Box style={{ width: '100%', ...props.cardStyle }}>
      <Box>
        <DetailField field={{ label: 'First Name', value: props.pap.person?.personal?.firstName }}></DetailField>
        <DetailField field={{ label: 'Last Name', value: props.pap.person?.personal?.lastName }}></DetailField>
        <DetailField field={{ label: 'Place of Birth', value: props.pap.person?.personal?.placeOfBirth }}></DetailField>
        <DetailField field={{ label: 'Date of Birth', value: props.pap.person?.personal?.dateOfBirth }}></DetailField>
        <DetailField field={{ label: 'Nationality', value: props.pap.person?.personal?.nationality }}></DetailField>
        <DetailField
          field={{ label: 'National ID (last 4 digits)', value: props.pap.person?.personal?.nationalID }}></DetailField>
        <DetailField field={{ label: 'Organization', value: props.pap.person?.personal?.organization }}></DetailField>
      </Box>
      <Box align="center">
        {props.pap.person?.platforms?.map((user) => {
          if (!user.platform || !user.username) return <></>;
          const platform = platforms[user.platform];
          const platformName = platform ? platform.name : 'custom';
          const field = { label: platformName, value: <PlatformUrl user={user} /> };
          return <DetailField key={JSON.stringify(user)} field={field} />;
        })}
      </Box>
      <Box style={{ margin: '16px 0px' }}>
        <Text style={{ fontWeight: 'bold' }}>Account:</Text>
        <Address digits={8} address={props.pap.account as HexStr} chainId={CHAIN_ID}></Address>
      </Box>
    </Box>
  ) : (
    <Spinner></Spinner>
  );
};
