import { Box, Text } from 'grommet';
import { FormNext, FormPrevious, StatusGood } from 'grommet-icons';
import { useState } from 'react';
import ReactSimplyCarousel from 'react-simply-carousel';

import { appName } from '../../config/community';
import { StatementEditable } from '../voice/StatementEditable';
import { AppButton } from '../../ui-components';
import { DetailsSelector } from './DetailsSelector';

export const CreateProject = () => {
  const [formIndex, setFormIndex] = useState(1);

  const boxStyle: React.CSSProperties = { width: '100vw', height: 'calc(100vh - 60px - 50px)', overflowY: 'auto' };

  const btnStyle: React.CSSProperties = {
    width: '0px',
    display: 'none',
  };

  const nextPage = () => {
    setFormIndex(formIndex + 1);
  };

  const prevPage = () => {
    setFormIndex(formIndex - 1);
  };

  const nextStr = formIndex === 1 ? 'review' : 'next';

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
              <StatementEditable placeholder="What..."></StatementEditable>
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
              <StatementEditable placeholder="Who..."></StatementEditable>
            </Box>
          </Box>

          <Box style={{ width: '100%', flexShrink: 0, overflowY: 'auto' }} pad="large">
            <DetailsSelector></DetailsSelector>
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
              <StatementEditable value={}></StatementEditable>
            </Box>
          </Box>

          <Box style={{ width: '100%', flexShrink: 0, overflowY: 'auto' }} pad="large">
            <DetailsSelector></DetailsSelector>
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
