const React = require('react')

setHeadComponents([
  <script
    async
    defer
    data-domain="dappnode.io"
    src="https://plausible.io/js/plausible.js"
  ></script>,
])

exports.onRenderBody = ({ setPreBodyComponents }) => {
  setPreBodyComponents([
    <noscript key="noscript">
      Your browser does not support JavaScript!
    </noscript>,
  ])
}
