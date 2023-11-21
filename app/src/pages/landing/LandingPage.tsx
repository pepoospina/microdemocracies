import { Box, Text } from 'grommet';
import { appName } from '../../config/community';
import { AppButton } from '../../ui-components';
import { useNavigate } from 'react-router-dom';
import { RouteNames } from '../../App';
import { useResponsive } from '../../components/app';
import { FormNext, FormPrevious } from 'grommet-icons';
import { useState, useCallback, useEffect } from 'react';
import { AppCarousel } from '../../ui-components/AppCarousel';
import { LearnMoreItem } from './LearnMoreItem';

export const Bold = (props: React.PropsWithChildren) => {
  return <span style={{ fontWeight: '400' }}>{props.children}</span>;
};

const N_SLIDES = 4;

export const LandingPage = () => {
  const navigate = useNavigate();
  const { mobile } = useResponsive();

  const logoSize = mobile ? '36px' : '48px';

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const btnText = (() => {
    if (activeSlideIndex === N_SLIDES - 1) return 'start now';
    return 'next';
  })();

  const btnClick = () => {
    if (activeSlideIndex === N_SLIDES - 1) return navigate(RouteNames.Start);
    nextSlide();
  };

  const btnPrimary = (() => {
    if (activeSlideIndex === N_SLIDES - 1) return true;
    return false;
  })();

  const showOpenApp = activeSlideIndex === N_SLIDES - 1;

  const prevSlide = () => {
    if (activeSlideIndex > 0) {
      setActiveSlideIndex(activeSlideIndex - 1);
    }
  };

  const nextSlide = () => {
    if (activeSlideIndex < N_SLIDES - 1) {
      setActiveSlideIndex(activeSlideIndex + 1);
    }
  };

  // Function to handle key press events
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        prevSlide();
      } else if (event.key === 'ArrowRight') {
        nextSlide();
      } else if (event.key === 'Enter') {
        btnClick();
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

  const goApp = () => {
    navigate('/home');
  };

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
      <Box justify="center" align="center" style={{ flexShrink: '0', marginTop: '6vh' }}>
        <Text size={logoSize} weight="bold">
          {appName}
        </Text>
      </Box>

      <Box style={{ flexGrow: '2', width: '100%', flexShrink: '0' }} justify="center" align="center">
        <Box fill align="center">
          <Box style={{ flexGrow: '1', width: '100%', flexShrink: '0' }} justify="center" align="center">
            <AppCarousel
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
                      Raise and handle funds <Bold>transparently</Bold>, no banks.
                    </>
                  }
                  secondaryText={<>(coming soon)</>}></LearnMoreItem>
              </Box>
            </AppCarousel>
          </Box>
        </Box>
      </Box>

      <Box justify="center" align="center" style={{ flexShrink: '0', marginBottom: '6vh' }}>
        <AppButton primary={btnPrimary} onClick={btnClick} label={btnText} style={{ margin: '12px 0px', width: '200px' }} />
        {showOpenApp ? <AppButton onClick={goApp} label={'Open app'} style={{ margin: '12px 0px', width: '200px' }} /> : <></>}
      </Box>
    </Box>
  );
};
