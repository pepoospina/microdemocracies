import { Box, TextArea } from 'grommet'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AppCard } from '../../ui-components'

export const AppLog = (props: {}) => {
  const { i18n } = useTranslation()

  const [debug, setDebug] = useState<any>()

  useEffect(() => {
    const preferred = localStorage.getItem('language')
    const selected = i18n.language
    const local = navigator.language.toLocaleLowerCase()
    setDebug({ lang: { preferred, selected, local } })
  }, [i18n.language])

  return (
    <Box style={{ flexGrow: 1 }} pad="medium">
      <TextArea readOnly style={{ flexGrow: 1, fontFamily: '"Roboto Mono", monospace' }}>
        {JSON.stringify(debug, null, 2)}
      </TextArea>
    </Box>
  )
}
