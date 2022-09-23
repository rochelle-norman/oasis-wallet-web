/**
 *
 * AmountFormatter
 *
 */
import { selectTicker } from 'app/state/network/selectors'
import * as React from 'react'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import { Text } from 'grommet'
import { StringifiedBigInt } from 'types/StringifiedBigInt'
import { formatBaseUnitsAsRose } from 'app/lib/helpers'
import BigNumber from 'bignumber.js'

export interface AmountFormatterProps {
  amount: StringifiedBigInt | null
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  hideTicker?: boolean
  size?: string
  smallTicker?: boolean
}

/**
 * Formats base unit amounts to ROSEs
 */
export const AmountFormatter = memo((props: AmountFormatterProps) => {
  const ticker = useSelector(selectTicker)
  if (props.amount == null) return <>-</>

  const amountString = formatBaseUnitsAsRose(props.amount, {
    minimumFractionDigits: props.minimumFractionDigits ?? 1,
    maximumFractionDigits: props.maximumFractionDigits ?? 15,
  })

  const decimalSeparator = BigNumber.config().FORMAT?.decimalSeparator
  const [amountInteger, amountFraction] = amountString.split(decimalSeparator!)

  const tickerProps = props.smallTicker
    ? {
        size: 'xsmall',
        weight: 600,
        color: '#a3a3a3',
      }
    : {}

  return (
    <span>
      {amountInteger}
      {amountFraction && (
        <>
          {decimalSeparator}
          <small style={{ lineHeight: 1 }}>{amountFraction}</small>
        </>
      )}
      {!props.hideTicker && (
        <Text margin={{ left: 'xxsmall' }} size={props.size} {...tickerProps}>
          {ticker}
        </Text>
      )}
    </span>
  )
})
