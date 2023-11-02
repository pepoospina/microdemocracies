import { Box } from 'grommet';
import { AppButton, AppFormField, AppInput, AppSelect, FieldLabel, TwoColumns } from '../../ui-components';
import { useState } from 'react';
import { PlatformAccount, PlatformId } from '../../types';

export interface PlatformDetails {
  name: string;
  usernameUrl?: (username: string) => string;
  iconUri?: string;
  placeholder?: string;
}

type Platforms = Partial<Record<PlatformId, PlatformDetails>>;

export const platforms: Platforms = {
  [PlatformId.X]: {
    name: 'X/Twitter',
    usernameUrl: (username: string) => `https://x.com/${username}`,
  },
  [PlatformId.Telegram]: {
    name: 'Telegram',
    usernameUrl: (username: string) => `https://t.me/${username}`,
  },
  [PlatformId.Email]: {
    name: 'Email',
    usernameUrl: (username: string) => `mailto:${username}`,
  },
  [PlatformId.Whatsapp]: {
    name: 'Whatsapp',
    usernameUrl: (username: string) => `https://wa.me/${username}`,
  },
  [PlatformId.Facebook]: {
    name: 'Facebook',
    usernameUrl: (username: string) => `https://facebook.com/${username}`,
  },
  [PlatformId.Instagram]: {
    name: 'Instagram',
    usernameUrl: (username: string) => `https://instagram.com/${username}`,
  },
  [PlatformId.Discord]: {
    name: 'Discord',
    usernameUrl: (username: string) => `https://discordapp.com/users/${username}`,
  },
  [PlatformId.Custom]: {
    name: 'Custom',
    usernameUrl: (username: string) => `${username}`,
  },
};

export interface INetworkSelector {
  onSelected: (user: PlatformAccount) => void;
}

export const NetworkSelector = (props: INetworkSelector) => {
  const [platform, setPlatform] = useState<PlatformId>();
  const [username, _setUsername] = useState<string>('');

  const setNetworkSelected = (_network: PlatformId) => {
    setPlatform(_network);
  };

  const setUsername = (_username: string) => {
    _setUsername(_username);
  };

  const addAccount = () => {
    if (!username || !platform) return;
    _setUsername('');

    props.onSelected({
      platform,
      username,
    });
  };

  return (
    <Box style={{ flexShrink: 0 }}>
      <TwoColumns gap="12px">
        <Box>
          <AppFormField label={<FieldLabel label="Platform"></FieldLabel>}>
            <AppSelect
              value={
                platform ? (
                  <Box style={{ height: '50px', justifyContent: 'center' }}>{platforms[platform]?.name}</Box>
                ) : (
                  <Box>Select</Box>
                )
              }
              onChange={(e) => setNetworkSelected(e.target.value)}
              options={Object.keys(platforms)}>
              {(option: PlatformId) => {
                return <Box style={{ padding: '8px 12px' }}>{platforms[option]?.name}</Box>;
              }}
            </AppSelect>
          </AppFormField>
        </Box>
        <Box>
          <AppFormField label={<FieldLabel label="Username"></FieldLabel>}>
            <AppInput value={username} onChange={(event) => setUsername(event.target.value)}></AppInput>
          </AppFormField>
        </Box>
      </TwoColumns>
      <Box style={{ width: '100%' }} align="center">
        <AppButton
          label="ADD"
          primary
          style={{ width: '200px' }}
          onClick={() => addAccount()}
          disabled={!username || !platform}></AppButton>
      </Box>
    </Box>
  );
};
