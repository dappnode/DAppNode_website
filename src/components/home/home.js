import React from 'react'

import links from '../../links.json'
import '../../../node_modules/video-react/dist/video-react.css'
import './main.css'
import { Player } from 'video-react'
import thumbnail from '../../images/thumbnail.jpg'
import video from '../../images/video.mp4'
import BigPlayButton from 'video-react/lib/components/BigPlayButton'

const Home = () => (
  <div className='section cta'>
    <h1>Decentralized Networking</h1>
    <p>DAppNode connects the decentralized internet by allowing a user to conveniently host P2P clients.</p>
    <div className='mobileCTA'>
      <ul>
        <li><a href={links.install} target='_blank' rel="noopener noreferrer">Install</a></li>
        <li><a href={links.docs} target='_blank' rel="noopener noreferrer">Documentation</a></li>
      </ul>
    </div>
    <div>
        <Player playsInline fluid poster={thumbnail} src={video}>
            <BigPlayButton position='center' />
        </Player>
    </div>
  </div>
)

export default Home
