import * as React from 'react'

interface Props {
  children: React.ReactNode
}

/**
 * Disable copying and disable Google Translate on child element
 * https://cloud.google.com/translate/troubleshooting
 *
 * Main usage is to display generated mnemonic without modifications, and
 * without sending it to Google servers.
 */
export function NoCopyNoTranslate(props: Props) {
  return (
    <span className="notranslate" translate="no" style={{ userSelect: 'none' }}>
      {props.children}
    </span>
  )
}
