import React from 'react'
import { Box, Text } from 'grommet'
import { useThemeContext } from '../../components/app'

export const ProgressBar = (props: { ratio: number; label?: string }) => {
  const { constants } = useThemeContext()
  const widthPercentage = Math.min(Math.max(props.ratio, 0), 1) * 100
  const widthPercentageStr = `${widthPercentage}%` // Ensure ratio is between 0 and 1

  const numberLeft = widthPercentage < 80 ? `calc(${widthPercentageStr} + 5px)` : `calc(${widthPercentageStr} - 65px)`
  const textAlign = widthPercentage < 80 ? 'left' : 'right'

  return (
    <Box style={{ width: '100%', margin: '16px 0 8px 0' }}>
      <Text size="small">{props.label}</Text>
      <Box
        style={{
          width: '100%',
          backgroundColor: constants.colors.backgroundLightDarker,
          borderRadius: '2px',
          position: 'relative',
        }}
      >
        <Box
          style={{
            height: '36px',
            backgroundColor: constants.colors.primary,
            borderRadius: '2px 0px 0px 2px',
            width: widthPercentageStr,
          }}
          direction="row"
        ></Box>
        <Text
          style={{
            position: 'absolute',
            left: numberLeft,
            top: '6px',
            fontWeight: 'bold',
            width: '60px',
            textAlign,
          }}
          color={'white'}
        >
          {props.ratio * 100} %
        </Text>
      </Box>
    </Box>
  )
}
