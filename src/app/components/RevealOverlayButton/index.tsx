import { Button } from 'grommet/es6/components/Button'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { Box } from 'grommet/es6/components/Box'
import { Text } from 'grommet/es6/components/Text'
import { StubElementWithSameSize } from './StubElementWithSameSize'

interface Props {
  label: string
  children: React.ReactNode
}

/**
 * Hides children until clicked.
 *
 * Note: Children are invisibly mounted once to measure their dimensions. After
 * that they are replaced by the same size div and covered by the same size btn.
 */
export const RevealOverlayButton = (props: Props) => {
  const [hasRevealed, setHasRevealed] = useState(false)
  return (
    <Box style={{ position: 'relative' }}>
      <Button
        label={
          <Text color="link" weight="bold">
            {props.label}
          </Text>
        }
        style={{
          visibility: hasRevealed ? 'hidden' : 'visible',
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
        color="lightText"
        onClick={() => setHasRevealed(true)}
      />
      <div style={{ visibility: hasRevealed ? 'visible' : 'hidden' }}>
        <StubElementWithSameSize doStub={!hasRevealed}>{props.children}</StubElementWithSameSize>
      </div>
    </Box>
  )
}
