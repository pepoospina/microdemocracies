import QRCodeSVG from 'qrcode.react'
import { useRef } from 'react'
import { useResponsive } from './app'
import { BoxCentered } from '../ui-components/BoxCentered'

export interface IQRCode {
  input: string
}

export const AppQRCode = (props: IQRCode) => {
  const { vw } = useResponsive()
  const boxRef = useRef<HTMLDivElement>(null)
  const stringifiedData = props.input

  const size = vw - 40 < 300 ? vw - 40 : 300

  return (
    <BoxCentered fill id="Box" ref={boxRef}>
      <QRCodeSVG value={stringifiedData} size={size} />
    </BoxCentered>
  )
}
