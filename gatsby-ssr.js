import React from 'react'

export function onRenderBody({ setPreBodyComponents }) {
  setPreBodyComponents([
    <noscript key="noscript">
      Your browser does not support JavaScript!
    </noscript>,
  ])
}
