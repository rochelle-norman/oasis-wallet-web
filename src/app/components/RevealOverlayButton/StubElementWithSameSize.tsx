import React, { useEffect, useRef, useState } from 'react'

interface Props {
  children: React.ReactNode
  doStub: boolean
}

export const StubElementWithSameSize = (props: Props) => {
  const childrenRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState<null | { width: number; height: number }>(null)

  useEffect(() => {
    if (childrenRef.current) {
      setDimensions({
        width: childrenRef.current.offsetWidth,
        height: childrenRef.current.offsetHeight,
      })
    }
  }, [])

  return (
    <>
      {!dimensions || !props.doStub ? (
        // Use visibility: hidden when initially measuring the element height
        <div ref={childrenRef} style={{ visibility: !dimensions ? 'hidden' : 'visible' }}>
          {props.children}
        </div>
      ) : (
        <div style={{ width: dimensions.width, height: dimensions.height }}></div>
      )}
    </>
  )
}
