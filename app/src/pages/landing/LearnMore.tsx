import React, { useState } from 'react';
import { Box, Button, Text } from 'grommet';
import ReactSimplyCarousel from 'react-simply-carousel';

import { appName } from '../../config/community';
import { BoxCentered } from '../../ui-components/BoxCentered';
import { LandingRouteNames } from '../MainLandingPage';
import { useNavigate } from 'react-router-dom';
import { AppButton } from '../../ui-components';
import { FormNext, FormPrevious } from 'grommet-icons';
import { LearnMoreItem } from './LearnMoreItem';

export const LearnMore = () => {
  const navigate = useNavigate();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const btnStyle: React.CSSProperties = {
    alignSelf: 'center',
    border: 'none',
    borderRadius: '50%',
    backgroundColor: 'transparent',
  };

  const boxStyle: React.CSSProperties = { width: 'calc(100vw - 100px)' };

  return (
    <Box fill align="center">
      <Box justify="center" align="center" style={{ flexShrink: '0', marginTop: '16px' }}>
        <Text size="22px" weight="bold">
          {appName}
        </Text>
      </Box>

      <BoxCentered style={{ marginTop: '56px' }}>
        <Text style={{ fontSize: '42px' }}>How it works</Text>
      </BoxCentered>

      <Box style={{ flexGrow: '2', width: '100vw', flexShrink: '0' }} justify="center" align="center">
        <ReactSimplyCarousel
          infinite={false}
          activeSlideIndex={activeSlideIndex}
          onRequestChange={setActiveSlideIndex}
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
          responsiveProps={[
            {
              itemsToShow: 2,
              itemsToScroll: 2,
              minWidth: 768,
            },
          ]}
          speed={400}
          easing="linear">
          <Box style={boxStyle}>
            <LearnMoreItem
              mainText={
                <>
                  Find something you know enough people <span style={{ fontWeight: '400' }}>want</span> to change.
                </>
              }
              secondaryText={
                <>
                  Better if it is <span style={{ fontWeight: '400' }}>small</span> and{' '}
                  <span style={{ fontWeight: '400' }}>close to you</span>.
                </>
              }></LearnMoreItem>
          </Box>

          <Box style={boxStyle}>
            <LearnMoreItem
              mainText={
                <>
                  Invite others to change it, <span style={{ fontWeight: '400' }}>together</span>.
                </>
              }
              secondaryText={<>And invite them, in turn, to invite others.</>}></LearnMoreItem>
          </Box>

          <Box style={boxStyle}>
            <LearnMoreItem
              mainText={
                <>
                  Converge into one <span style={{ fontWeight: '400' }}>loud</span> and{' '}
                  <span style={{ fontWeight: '400' }}>clear</span> collective{' '}
                  <span style={{ fontWeight: '400' }}>voice</span>.
                </>
              }
              secondaryText={
                <>
                  Micro(r)evolutions brings <span style={{ fontWeight: '400' }}>clarity</span> and help you converge
                  your collective ideas into <span style={{ fontWeight: '400' }}>action</span>.
                </>
              }></LearnMoreItem>
          </Box>

          <Box style={boxStyle}>
            <LearnMoreItem
              mainText={
                <>
                  Become <span style={{ fontWeight: '400' }}>powerful</span>, raise funds, and spend them together.
                </>
              }
              secondaryText={<>Handle community funds securely, transparently and collectively.</>}></LearnMoreItem>
          </Box>
        </ReactSimplyCarousel>
      </Box>

      <BoxCentered style={{ flexShrink: '0', marginBottom: '6vh' }}>
        <AppButton
          primary
          onClick={() => navigate(LandingRouteNames.Start)}
          label="Start now"
          style={{ width: '200px' }}
        />
      </BoxCentered>
    </Box>
  );
};
