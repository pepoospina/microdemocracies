import { useState, useCallback, useEffect } from 'react';
import { Box, Text } from 'grommet';
import { FormNext, FormPrevious } from 'grommet-icons';
import { Trans, useTranslation } from 'react-i18next';

import { RouteNames } from '../../@app/route.names';

import { AppButton } from '../../@app/ui-components/AppButton';
import { AppCarousel } from '../../@app/ui-components/AppCarousel';
import { useResponsive } from '../../@app/components/app/ResponsiveApp';
import { LanguageSelector } from '../../@app/pages/account/LanguageSelector';

import { APP_ORIGIN } from '../../config';
import { LearnMoreItem } from './LearnMoreItem';

export const Bold = (props: React.PropsWithChildren) => {
  return <span style={{ fontWeight: '400' }}>{props.children}</span>;
};

const N_SLIDES = 3;

export const LandingPage = () => {
  const { mobile } = useResponsive();
  const { t } = useTranslation();

  const logoSize = mobile ? '32px' : '48px';

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const btnText = (() => {
    if (activeSlideIndex === N_SLIDES - 1) return t('startNow');
    return t('next');
  })();

  const btnClick = () => {
    if (activeSlideIndex === N_SLIDES - 1) {
      /** create new project */
      window.location.href = `${APP_ORIGIN}/${RouteNames.Start}`;
    }
    nextSlide();
  };

  const btnPrimary = (() => {
    if (activeSlideIndex === N_SLIDES - 1) return true;
    return false;
  })();

  const showLanguageSelector = true;

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
    window.location.href = `${APP_ORIGIN}/${RouteNames.AppHome}`;
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
      <Box
        justify="center"
        align="center"
        style={{ flexShrink: '0', marginTop: '3vh', width: '100%' }}>
        {showLanguageSelector ? (
          <Box fill justify="end" direction="row" pad={{ horizontal: 'large' }}>
            <LanguageSelector></LanguageSelector>
          </Box>
        ) : (
          <></>
        )}
        <Text size={logoSize} weight="bold" style={{ marginTop: '3vh' }}>
          {t('appName')}
        </Text>
      </Box>

      <Box
        style={{ flexGrow: '2', width: '100%', flexShrink: '0' }}
        justify="center"
        align="center">
        <Box fill align="center">
          <Box
            style={{ flexGrow: '1', width: '100%', flexShrink: '0' }}
            justify="center"
            align="center">
            <AppCarousel
              swipeTreshold={0.15}
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
                  <Box
                    align="center"
                    justify="center"
                    style={{ height: 36, width: 36 }}>
                    <FormNext></FormNext>
                  </Box>
                ),
              }}
              backwardBtnProps={{
                style: btnStyle,
                children: (
                  <Box
                    align="center"
                    justify="center"
                    style={{ height: 36, width: 36 }}>
                    <FormPrevious></FormPrevious>
                  </Box>
                ),
              }}
              speed={400}
              easing="cubic-bezier(0.25, 0.1, 0.25, 1)">
              <Box style={boxStyle}>
                <LearnMoreItem
                  mainText={
                    <Trans
                      i18nKey="carousel01"
                      components={{ Bold: <Bold /> }}></Trans>
                  }
                  secondaryText={
                    <Trans
                      i18nKey="carousel01sub"
                      components={{ Bold: <Bold /> }}></Trans>
                  }></LearnMoreItem>
              </Box>

              <Box style={boxStyle}>
                <LearnMoreItem
                  mainText={
                    <Trans
                      i18nKey="carousel02"
                      components={{ Bold: <Bold /> }}></Trans>
                  }
                  secondaryText={
                    <Trans
                      i18nKey="carousel02sub"
                      components={{ Bold: <Bold /> }}></Trans>
                  }></LearnMoreItem>
              </Box>

              <Box style={boxStyle}>
                <LearnMoreItem
                  mainText={
                    <Trans
                      i18nKey="carousel03"
                      components={{ Bold: <Bold /> }}></Trans>
                  }
                  secondaryText={
                    <Trans
                      i18nKey="carousel03sub"
                      components={{ Bold: <Bold /> }}></Trans>
                  }></LearnMoreItem>
              </Box>
            </AppCarousel>
          </Box>
        </Box>
      </Box>

      <Box
        justify="center"
        align="center"
        style={{ flexShrink: '0', marginBottom: '6vh' }}>
        {showOpenApp ? (
          <AppButton
            onClick={goApp}
            label={t('openApp')}
            style={{ margin: '12px 0px', width: '220px' }}
          />
        ) : (
          <></>
        )}
        <AppButton
          primary={btnPrimary}
          onClick={btnClick}
          label={btnText}
          style={{ margin: '12px 0px', width: '220px' }}
        />
      </Box>
    </Box>
  );
};
