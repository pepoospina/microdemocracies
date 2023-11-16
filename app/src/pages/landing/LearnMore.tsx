import React, { useCallback, useEffect, useState } from 'react';
import { Box } from 'grommet';
import ReactSimplyCarousel from 'react-simply-carousel';

import { useNavigate } from 'react-router-dom';
import { FormNext, FormPrevious } from 'grommet-icons';
import { LearnMoreItem } from './LearnMoreItem';

const Bold = (props: React.PropsWithChildren) => {
  return <span style={{ fontWeight: '400' }}>{props.children}</span>;
};

const N_SLIDES = 4;

export const LearnMore = () => {
  const navigate = useNavigate();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Function to handle key press events
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        if (activeSlideIndex > 0) {
          setActiveSlideIndex(activeSlideIndex - 1);
        }
      } else if (event.key === 'ArrowRight') {
        if (activeSlideIndex < N_SLIDES - 1) {
          setActiveSlideIndex(activeSlideIndex + 1);
        }
      }
    },
    [activeSlideIndex]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const btnStyle: React.CSSProperties = {
    alignSelf: 'center',
    height: '100%',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '50%',
    backgroundColor: 'transparent',
  };

  const boxStyle: React.CSSProperties = {
    width: 'min(100vw - 100px, 600px)',
    padding: '0px 3vw',
    textAlign: 'center',
  };

  return (
    <Box fill align="center">
      <Box style={{ flexGrow: '1', width: '100%', flexShrink: '0' }} justify="center" align="center">
        <ReactSimplyCarousel
          disableSwipeByMouse
          infinite={false}
          activeSlideIndex={activeSlideIndex}
          onRequestChange={setActiveSlideIndex}
          itemsToShow={1}
          itemsToScroll={1}
          containerProps={{ style: { width: '100vw' } }}
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
          speed={400}
          easing="cubic-bezier(0.25, 0.1, 0.25, 1)">
          <Box style={boxStyle}>
            <LearnMoreItem
              mainText={
                <>
                  Find something you know <Bold>needs</Bold> to change.
                </>
              }
              secondaryText={
                <>
                  Dare others to change it, <Bold>together</Bold>.
                </>
              }></LearnMoreItem>
          </Box>

          <Box style={boxStyle}>
            <LearnMoreItem
              mainText={
                <>
                  Talk <Bold>without fear</Bold>.
                </>
              }
              secondaryText={
                <>
                  Hold <Bold>anonymous</Bold> conversations, <Bold>restricted</Bold> to members.
                </>
              }></LearnMoreItem>
          </Box>

          <Box style={boxStyle}>
            <LearnMoreItem
              mainText={
                <>
                  Amplify your <Bold>voice</Bold>.
                </>
              }
              secondaryText={
                <>
                  Anonymously <Bold>back</Bold> the statements you agree with.
                </>
              }></LearnMoreItem>
          </Box>

          <Box style={boxStyle}>
            <LearnMoreItem
              mainText={
                <>
                  Raise and spend funds <Bold>transparently</Bold>, without banks.
                </>
              }
              secondaryText={<>(comming soon)</>}></LearnMoreItem>
          </Box>

          {/* <Box style={boxStyle}>
            <LearnMoreItem
              mainText={<>Micro(r)evolutions is in closed beta.</>}
              secondaryText={
                <>
                  Can't wait? contact us at{' '}
                  <a href="mailto:start@microrevolutions.com" target="_blank" rel="noreferrer">
                    start@microrevolutions.com
                  </a>
                </>
              }></LearnMoreItem>
          </Box> */}
        </ReactSimplyCarousel>
      </Box>
    </Box>
  );
};
