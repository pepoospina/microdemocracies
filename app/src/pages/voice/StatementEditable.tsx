import { useEffect, useState } from 'react'

import { Box, Text } from 'grommet'

import { useThemeContext } from '../../components/app'
import './statements.css'

import { useTranslation } from 'react-i18next'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.bubble.css'

export interface IStatementEditable {
  placeholder?: string
  editable?: boolean
  value?: string
  onChanged?: (value?: string) => void
  onClick?: (e: React.MouseEvent) => void
  containerStyle?: React.CSSProperties
}

export const StatementEditable = (props: IStatementEditable) => {
  const { t } = useTranslation()
  const { constants } = useThemeContext()
  const [text, setText] = useState<string>()

  const editable = props.editable !== undefined && props.editable

  useEffect(() => {
    if (props.onChanged) {
      props.onChanged(text)
    }
  }, [text, props.onChanged])

  useEffect(() => {
    setText(props.value)
  }, [props.value])

  useEffect(() => {
    const LinkBlot = Quill.import('formats/link')

    class CustomLinkBlot extends LinkBlot {
      static create(value: any) {
        let node = super.create(value)
        value = this.sanitize(value)

        node.setAttribute('href', value)
        // If link does not start with 'http://' or 'https://', prepend 'http://'
        if (!/^https?:\/\//i.test(value)) {
          node.setAttribute('href', `http://${value}`)
        }
        return node
      }
    }

    Quill.register(CustomLinkBlot, true)
  }, [])

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'], // toggled buttons
      ['link'], // link button
    ],
  }

  return (
    <>
      <Box
        style={{
          backgroundColor: constants.colors.primary,
          color: constants.colors.textOnPrimary,
          fontSize: '48px',
          borderRadius: '6px',
          cursor: props.onClick ? 'pointer' : '',
          ...props.containerStyle,
        }}
        pad="small"
        onClick={props.onClick}
      >
        <Box>
          <ReactQuill
            placeholder={props.placeholder}
            theme="bubble"
            modules={modules}
            value={text}
            onChange={setText}
            readOnly={!editable}
          />
        </Box>
      </Box>
      {editable ? (
        <Box pad="small">
          <Text
            size="small"
            style={{ textAlign: 'center', color: constants.colors.primaryLight }}
          >
            {t('helpEditable')}
          </Text>
        </Box>
      ) : (
        <></>
      )}
    </>
  )
}
