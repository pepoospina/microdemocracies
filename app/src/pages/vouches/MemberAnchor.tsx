import { Anchor } from 'grommet';
import { useTranslation } from 'react-i18next';

export const MemberAnchor = (props: { tokenId: number }) => {
  const { t } = useTranslation();

  return (
    <Anchor>
      {t('member')} #{props.tokenId}
    </Anchor>
  );
};
