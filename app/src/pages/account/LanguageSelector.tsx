import { Box, DropButton, Image } from 'grommet';
import { AppButton } from '../../ui-components';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '../../components/app';
import { useState } from 'react';

export enum Language {
  ENG = 'ENG',
  SPA = 'SPA',
  CAT = 'CAT',
}

const LanguageValue = (key: Language) => {
  const flag = (() => {
    return <Image style={{ width: '24px' }} src={`/icons/${key}.\svg`}></Image>;
  })();
  return (
    <Box direction="row" align="center" gap="small" justify="center">
      {`(${key})`} {flag}
    </Box>
  );
};

export const LanguageSelector = (props: {}) => {
  const { i18n } = useTranslation();
  const selected = i18n.language as Language;

  const { vw } = useResponsive();

  const [showDrop, setShowDrop] = useState<boolean>();

  const width = vw > 600 ? 240 : 200;

  const changeLanguage = (key: Language) => {
    i18n.changeLanguage(key);
    setShowDrop(false);
  };

  return (
    <DropButton
      label={LanguageValue(selected)}
      open={showDrop}
      onClose={() => setShowDrop(false)}
      onOpen={() => setShowDrop(true)}
      dropContent={
        <Box style={{ width: `${width}px` }} pad="20px" gap="small">
          <AppButton
            style={{ width: `${width - 40}px` }}
            label={LanguageValue(Language.ENG)}
            onClick={() => changeLanguage(Language.ENG)}></AppButton>
          <AppButton
            style={{ width: `${width - 40}px` }}
            label={LanguageValue(Language.SPA)}
            onClick={() => changeLanguage(Language.SPA)}></AppButton>
          <AppButton
            style={{ width: `${width - 40}px` }}
            label={LanguageValue(Language.CAT)}
            onClick={() => changeLanguage(Language.CAT)}></AppButton>
        </Box>
      }
      dropProps={{ style: { width: `${width + 40}px`, marginTop: '60px' } }}></DropButton>
  );
};
