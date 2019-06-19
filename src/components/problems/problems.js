import React from 'react'

import './main.css'
import network from '../../images/vectors/bank.svg'
import bank from '../../images/vectors/network.svg'
import toolbox from '../../images/vectors/toolbox.svg'

/* TODO: Abstract and simplify to reduce manual div creation using arrays and React.Children.map */
const Problems = () => (
  <div className="section problems" id="aboutAnchor">
    <div>
      <p>Problems</p>
      <h1>We have a decentralization bottleneck</h1>
      <div>
        <img src={toolbox} alt="Toolbox" />
        <h3>Difficult to run</h3>
        <p>
          Running nodes involve troubleshooting, updates, and constant syncing.
        </p>
      </div>

      <div>
        <img src={bank} alt="Bank" />
        <h3>Centralizing forces</h3>
        <p>
          Users connect to centralized gateways through common wallets and
          DApps.
        </p>
      </div>

      <div>
        <img src={network} alt="Network" />
        <h3>Network variability</h3>
        <p>
          There are less nodes online everyday due to its ever increasing costs
        </p>
      </div>
    </div>
  </div>
)

export default Problems
