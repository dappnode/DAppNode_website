import React from 'react'

setHeadComponents([
  <script
    async
    defer
    data-domain="dappnode.io"
    src="https://plausible.io/js/plausible.js"
  ></script>,
])

export function onRenderBody({ setPreBodyComponents }) {
  setPreBodyComponents([
    <noscript key="noscript">
      Your browser does not support JavaScript!
    </noscript>,
  ])
}
