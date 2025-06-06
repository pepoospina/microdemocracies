import { Anchor, Text } from 'grommet'

import { PlatformAccount } from '../../shared/types'
import { platforms } from '../../utils/platforms'

export interface IPlatformUrl {
  user?: PlatformAccount
}

export const PlatformUrl = (props: IPlatformUrl) => {
  const user = props.user
  if (!user) {
    return <></>
  }
  const platform = platforms[user.platform]
  const url =
    platform && platform.usernameUrl ? platform && platform.usernameUrl(user.username) : ''
  return url ? (
    <Anchor href={url} target="_black">
      {user.username}
    </Anchor>
  ) : (
    <Text>{user.username}</Text>
  )
}
