import React from 'react'

import links from '../../links.json'
import './main.css'
import logo from '../../images/dappnode.png'

// This is a work in progress section for the live version 1.1 site.
const Footer = () => (
  <div className="section footer">
    <div>
      <h1>Ready to get started?</h1>
      <p>Setup your own DAppNode and connect to the decentralized internet.</p>
      <ul>
        <li>
          <a
            href={links.shop}
            className="install"
            target="_blank"
            rel="noopener noreferrer"
          >
            Shop
          </a>
        </li>
        <li>
          <a
            href={links.install}
            className="docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Install
          </a>
        </li>
      </ul>
    </div>
    <div>
      <img src={logo} alt="DAppNode logo" />
      <p>DAppNode | Decentralized P2P Networking | &copy; 2019</p>
    </div>
    <div className="community">
      <ul>
        <li>
          <a href={links.riot} target="_blank" rel="noopener noreferrer">
            Riot Chat
          </a>
        </li>
        <li>
          <a href={links.github} target="_blank" rel="noopener noreferrer">
            Github
          </a>
        </li>
        <li>
          <a href={links.twitter} target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
        </li>
      </ul>
    </div>
  </div>
)

export default Footer
