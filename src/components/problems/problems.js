import React from 'react'

import './main.css'
import network from '../../images/vectors/bank.svg'
import bank from '../../images/vectors/network.svg'
import toolbox from '../../images/vectors/toolbox.svg'

/* TODO: Abstract and simplify to reduce manual div creation using arrays and React.Children.map */
const Problems = () => (
  <div className='section problems' id='aboutAnchor'>
    <div>
        <p>Problems</p>
        <h1>We have a decentralization bottleneck.</h1>
        <div>
            <img src={network} alt='Network'/>
            <h3>Network variability</h3>
            <p>At no point in the last two years have there been more than 13,000 nodes
                online, and that number has gotten as low as 5,500.</p>
        </div>
        <div>
            <img src={bank} alt='Bank'/>
            <h3>Centralizing forces</h3>
            <p>Users use common wallet applications with default nodes, causing such wallets
                to have centralized network control.
            </p>
        </div>
        <div>
            <img src={toolbox} alt='Toolbox'/>
            <h3>Difficult deployment</h3>
            <p>Running your own node is difficult involving troubleshooting, updating, and
                syncing, and it's difficult to share access.</p>
        </div>
    </div>
  </div>
)

export default Problems
