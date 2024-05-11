import { Box, Spinner } from 'grommet'
import { Send, StatusGood } from 'grommet-icons'
import { useTranslation } from 'react-i18next'

import { AppQRCode } from '../../components/AppQRCode'
import { useProjectContext } from '../../contexts/ProjectContext'
import { I18Keys } from '../../i18n/kyel.list'
import { RouteNames } from '../../route.names'
import { AppButton } from '../../ui-components'
import { useCopyToClipboard } from '../../utils/copy.clipboard'

export interface IPAPShare {
  cid?: string
}

export const PAPShare = (props: IPAPShare) => {
  const cid = props.cid
  const { t } = useTranslation()

  const { projectId } = useProjectContext()

  const { copy, copied } = useCopyToClipboard()

  const share = () => {
    const link = `${window.origin}/p/${projectId}/${RouteNames.Invite}/${cid}`
    if (navigator.share) {
      navigator.share({
        url: link,
        text: t([I18Keys.askJoin]),
      })
    } else {
      copy(link)
    }
  }

  return (
    <Box fill pad="large" justify="center">
      {cid ? (
        <Box align="center" style={{ width: '100%' }}>
          <AppQRCode input={cid}></AppQRCode>
          <Box margin="large" direction="row" align="center" style={{ width: '100%' }}>
            <AppButton
              onClick={() => share()}
              icon={copied ? <StatusGood></StatusGood> : <Send></Send>}
              reverse
              primary
              style={{ marginLeft: '12px', width: '100%' }}
              label={copied ? 'link copied!' : 'share'}
            ></AppButton>
          </Box>
        </Box>
      ) : (
        <Box fill align="center" justify="center">
          <Spinner></Spinner>
        </Box>
      )}
    </Box>
  )
}
