import { Box, Image } from 'grommet';
import { AppButton, AppCircleDropButtonResponsive } from '../../ui-components';
import { useResponsive } from '../../components/app';
import { useState } from 'react';
import { Language, useAppLanguage } from '../../components/app/AppLanguage';

const LanguageValue = (key: Language, hideIfMobile: boolean = false) => {
  const { mobile } = useResponsive();

  const flag = (() => {
    return <Image style={{ width: '24px' }} src={`/icons/${key}.\svg`}></Image>;
  })();

  return (
    <Box direction="row" align="center" gap={!mobile ? 'small' : '0px'} justify="center">
      <Box>{mobile && hideIfMobile ? '' : `(${key})`}</Box>
      <Box>{flag}</Box>
    </Box>
  );
};

export const LanguageSelector = (props: {}) => {
  const { selected, change } = useAppLanguage();
  const { vw } = useResponsive();

  const [showDrop, setShowDrop] = useState<boolean>();

  const width = vw > 600 ? 240 : 200;

  const changeLanguage = (key: Language) => {
    change(key);
    setShowDrop(false);
  };

  return (
    <AppCircleDropButtonResponsive
      label={LanguageValue(selected, true)}
      open={showDrop}
      onClose={() => setShowDrop(false)}
      onOpen={() => setShowDrop(true)}
      dropContent={
        <Box style={{ width: `${width}px` }} pad="20px" gap="small">
          {Object.keys(Language).map((key: string) => {
            return (
              <AppButton
                style={{ width: `${width - 40}px` }}
                label={LanguageValue(key as Language, false)}
                onClick={() => changeLanguage(key as Language)}></AppButton>
            );
          })}
        </Box>
      }
      dropProps={{ style: { width: `${width + 40}px`, marginTop: '60px' } }}></AppCircleDropButtonResponsive>
  );
};
