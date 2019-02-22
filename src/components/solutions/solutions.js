import React from 'react'

import './main.css'
import checkmark from '../../images/vectors/checkmark.svg'

const cardText = [
  'Take control your privacy and data',
  'Join a P2P economy: PoS mining, etc',
  'Share access with family and friends',
  'Easy setup for any user',
  'Run private copies of DApps 24/7',
  'Browse decentralized websites',
];

const Solutions = () => (

  <div className='section solutions'>
    <p>Solution</p>
    <h1>Simple node deployment.</h1>
    <p className='solutionText'>DAppNode bridges the gap between the benefits of hosting a decentralized P2P
      network, and the difficulty of putting in time and effort to setup your own
      nodes.</p>
    <br/>
    <div>
      {cardText.map((value, index) => {
        return <div key={index}>
          <div><img src={checkmark} alt='checkmark'/></div>
          <div>
            <p>{value}</p>
          </div>
        </div>
      })}
    </div>
    <h5>+ many more benefits...</h5>
  </div>
)

export default Solutions
