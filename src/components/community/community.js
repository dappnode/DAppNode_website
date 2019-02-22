import React from 'react'

import links from '../../links.json'
import './main.css'

const Community = () => {

  return (
  <div className='section community' id='communityAnchor'>
    <h1>Connect with DAppNode.</h1>
    <p>Learn more about DAppNode, chat with the team, and contribute to the future of decentralized networking.</p>
    <ul>
      <li>
          <a href={links.riot} target='_blank' rel="noopener noreferrer">Riot Chat</a>
      </li>
      <li>
          <a href={links.github} target='_blank' rel="noopener noreferrer">Github</a>
      </li>
      <li>
          <a href={links.twitter} target='_blank' rel="noopener noreferrer">Twitter</a>
      </li>
    </ul>
    {/* TODO: Use gatsby-source-medium to retrieve this content instead of hard coding it in as it currently is.*/}
    <div className='blog'>
      <a href='https://medium.com/@DAppNode/dappnode-loves-bufficorns-ethdenverimpact-5e6ddbe74fbc' target='_blank' rel="noopener noreferrer"><div>
        <div className='blog1'></div>
        <div>
          <h3>DAppNode loves #Bufficorns #ETHDenverImpact</h3>
        </div>
      </div></a>
      <a href='https://medium.com/@DAppNode/dappnode-and-constantinople-postponement-bdec66a62aba' target='_blank' rel="noopener noreferrer"><div>
        <div className='blog2'></div>
        <div>
          <h3>DAppNode Constantinople Postponement</h3>
        </div>
      </div></a>
      <a href='https://medium.com/@DAppNode/dappnode-nfts-have-arrived-237e0c99712b' target='_blank' rel="noopener noreferrer"><div>
        <div className='blog3'></div>
        <div>
          <h3>DAppNode NFT's Have Arrived!</h3>
        </div>
      </div></a>
      <a href='https://medium.com/@DAppNode/dappnodes-gift-to-labitconf-6129d53b0f71' target='_blank' rel="noopener noreferrer"><div>
        <div className='blog4'></div>
        <div>
          <h3>DAppNode's Git to LaBITConf</h3>
        </div>
      </div></a>
      <a href='https://medium.com/@DAppNode/dappnode-the-infrastructure-for-the-decentralized-world-85983b16db14' target='_blank' rel="noopener noreferrer"><div>
        <div className='blog5'></div>
        <div>
          <h3>DAppNode: Decentralized World</h3>
        </div>
      </div></a>
      <a href='https://medium.com/@DAppNode/advances-in-decentralized-infrastructure-v0-1-6def6d77e7ee' target='_blank' rel="noopener noreferrer"><div>
        <div className='blog6'></div>
        <div>
          <h3>Advances in Decentralized Infrastructure V0.1</h3>
        </div>
      </div></a>
    </div>
  </div>
  )

}

export default Community