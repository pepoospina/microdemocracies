import { Box, Text } from 'grommet';
import { FormNext, FormPrevious } from 'grommet-icons';
import { useEffect, useState } from 'react';
import ReactSimplyCarousel from 'react-simply-carousel';

import { appName } from '../../config/community';
import { StatementEditable } from '../voice/StatementEditable';
import { AppButton, AppHeading } from '../../ui-components';
import { DetailsSelector, SelectedDetails } from './DetailsSelector';
import { DetailsSelectedSummary } from './DetailsSelectedSummary';
import { useCreateProject } from '../../contexts/CreateProjectContext';
import { DetailsForm } from '../join/DetailsForm';
import { AppAccountSelector } from '../join/AccountSelector';
import { HexStr } from '../../types';

const NPAGES = 5;

export const CreateProject = () => {
  const [formIndex, setFormIndex] = useState(0);

  const [account, setAccount] = useState<string>();
  const [whoStatement, setWhoStatement] = useState<string>();
  const [whatStatement, setWhatStatement] = useState<string>();
  const [selectedDetails, setDetails] = useState<SelectedDetails>();

  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<boolean>();
  const { setCreateParams, sendCreateProject, isErrorSending, errorSending, isSuccess } = useCreateProject();

  const boxStyle: React.CSSProperties = { width: '100vw', height: 'calc(100vh - 60px - 50px)', overflowY: 'auto' };

  const btnStyle: React.CSSProperties = {
    width: '0px',
    display: 'none',
  };

  const createProject = () => {};

  useEffect(() => {
    // console.log('useEffect isSuccess', { isSuccess });
    if (isSuccess) {
      setSending(false);
      setError(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  useEffect(() => {
    // console.log('useEffect isErrorSending', { isErrorSending, errorSending });
    if (isErrorSending) {
      setSending(false);
      setError((errorSending as any).shortMessage);
    }
  }, [isErrorSending, errorSending]);

  const nextPage = () => {
    if (formIndex < NPAGES - 1) {
      setFormIndex(formIndex + 1);
    }

    if (formIndex === NPAGES - 1) {
      createProject();
    }
  };

  const prevPage = () => {
    if (formIndex > 0) {
      setFormIndex(formIndex - 1);
    }
  };

  const nextStr = (() => {
    if (formIndex === 2) return 'next';
    if (formIndex === 3) return 'review';
    if (formIndex === 4) return 'create';
    return 'next';
  })();

  return (
    <Box fill align="center">
      <Box justify="center" align="center" style={{ flexShrink: '0', height: '50px' }}>
        <Text size="22px" weight="bold">
          {appName}
        </Text>
      </Box>

      <ReactSimplyCarousel
        infinite={false}
        activeSlideIndex={formIndex}
        onRequestChange={setFormIndex}
        itemsToShow={1}
        itemsToScroll={1}
        forwardBtnProps={{
          style: btnStyle,
          children: (
            <Box align="center" justify="center" style={{ height: 36, width: 36 }}>
              <FormNext></FormNext>
            </Box>
          ),
        }}
        backwardBtnProps={{
          style: btnStyle,
          children: (
            <Box align="center" justify="center" style={{ height: 36, width: 36 }}>
              <FormPrevious></FormPrevious>
            </Box>
          ),
        }}
        containerProps={{
          style: {
            height: '100%',
          },
        }}
        speed={400}
        easing="linear">
        <Box style={boxStyle} id="a">
          <Box style={{ width: '100%', flexShrink: 0 }} pad="large">
            <Box style={{ marginBottom: '12px', fontSize: '10px', fontWeight: '300' }}>
              <Text>
                Write here <span style={{ fontWeight: '400' }}>what</span> you to want achieve
              </Text>
            </Box>
            <Box>
              <StatementEditable
                placeholder="What..."
                editable
                onChanged={(value) => setWhatStatement(value)}></StatementEditable>
            </Box>
          </Box>

          <Box style={{ width: '100%', flexShrink: 0 }} pad="large">
            <Box style={{ marginBottom: '12px', fontSize: '10px', fontWeight: '300' }}>
              <Text>Remember</Text>
            </Box>
            <Box style={{ marginTop: '0px' }}>
              <Text style={{ fontSize: '24px', lineHeight: '150%', fontWeight: '300' }}>
                Try to make it <span style={{ fontWeight: '400' }}>small</span>,{' '}
                <span style={{ fontWeight: '400' }}>achievable</span> and{' '}
                <span style={{ fontWeight: '400' }}>close to you</span>.
              </Text>
            </Box>
          </Box>
        </Box>
        <Box style={boxStyle}>
          <Box style={{ width: '100%', flexShrink: 0 }} pad="large">
            <Box style={{ marginBottom: '12px', fontSize: '10px', fontWeight: '300', flexShrink: 0 }}>
              <Text>
                Can participate anyone <span style={{ fontWeight: '400' }}>who</span>:
              </Text>
            </Box>
            <Box>
              <StatementEditable
                onChanged={(value) => setWhoStatement(value)}
                editable
                placeholder="Who..."></StatementEditable>
            </Box>
          </Box>

          <Box style={{ width: '100%', flexShrink: 0, overflowY: 'auto' }} pad="large">
            <DetailsSelector onChanged={(details) => setDetails(details)}></DetailsSelector>
          </Box>
        </Box>

        <Box style={boxStyle}>
          <Box style={{ width: '100%', flexShrink: 0 }} pad="large">
            <Box style={{ marginBottom: '24px' }}>
              <AppHeading>Your Details</AppHeading>
              <Box>
                <Text>All members of the commuity are expected to provide their details. Including you :)</Text>
              </Box>
            </Box>
            <DetailsForm selected={selectedDetails}></DetailsForm>
          </Box>
        </Box>

        <Box style={boxStyle}>
          <Box style={{ width: '100%', flexShrink: 0 }} pad="large">
            <Box pad="large" style={{ flexShrink: 0 }}>
              <AppHeading level="2" style={{ marginBottom: '16px' }}>
                Select the account
              </AppHeading>
              <AppAccountSelector
                onSelected={(account) => setAccount(account)}
                style={{ marginBottom: '30px' }}></AppAccountSelector>
            </Box>
          </Box>
        </Box>

        <Box style={boxStyle}>
          <Box style={{ width: '100%', flexShrink: 0 }} pad="large">
            <Box style={{ marginBottom: '12px', fontSize: '10px', fontWeight: '300', flexShrink: 0 }}>
              <Text>
                <span style={{ fontWeight: '400' }}>What</span> we want to achieve:
              </Text>
            </Box>
            <Box>
              <StatementEditable value={whatStatement}></StatementEditable>
            </Box>

            <Box style={{ margin: '36px 0 12px 0', fontSize: '10px', fontWeight: '300', flexShrink: 0 }}>
              <Text>
                <span style={{ fontWeight: '400' }}>Who</span> can participate:
              </Text>
            </Box>
            <Box>
              <StatementEditable value={whoStatement}></StatementEditable>
            </Box>
          </Box>

          <Box pad="large">
            <Text>Particinats will be asked to provied:</Text>
            <DetailsSelectedSummary selected={selectedDetails}></DetailsSelectedSummary>
            {/* <AccountPerson pap={founderPap}></AccountPerson> */}
          </Box>
        </Box>
      </ReactSimplyCarousel>

      <Box direction="row" style={{ flexShrink: 0, height: '60px' }}>
        <AppButton onClick={() => prevPage()} label="prev" style={{ margin: '0px 0px', width: '200px' }} />
        <AppButton primary onClick={() => nextPage()} label={nextStr} style={{ margin: '0px 0px', width: '200px' }} />
      </Box>
    </Box>
  );
};
