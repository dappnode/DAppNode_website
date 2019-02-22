// Base imports.
import React from 'react'
import './main.css'

// Import package to handle image hover-over color change.
import HoverImage from 'react-hover-image'

// Import seperate images (non-hover color).
import ef from '../../images/vectors/ef.svg'
import aragon from '../../images/vectors/nest.svg'
import giveth from '../../images/vectors/giveth.svg'
import ecf from '../../images/vectors/ecf.svg'

// Import seperate images (hover color).
import efhover from '../../images/vectors/efhover.svg'
import givethhover from '../../images/vectors/givethhover.svg'
import aragonhover from '../../images/vectors/nesthover.svg'
import ecfhover from '../../images/vectors/ecfhover.svg'

// Declare supports section.
const Supports = () => (
  <div className='section supports'>
    <p>Supported through grants and funds from: </p>
    {/* Seperate grants are linked accordingly */}
    <a href='https://blog.ethereum.org/2018/08/17/ethereum-foundation-grants-update-wave-3/' target='_blank' rel="noopener noreferrer">
      <HoverImage src={ef} hoverSrc={efhover} alt='Ethereum Foundation'/>
    </a>
    <a href='https://ecf.network/' target='_blank' rel="noopener noreferrer">
      <HoverImage src={ecf} hoverSrc={ecfhover} alt='Ethereum Community Fund'/>
    </a>
    <a href='https://blog.aragon.org/aragon-nest-second-round-of-grants/#dappnode' target='_blank' rel="noopener noreferrer">
      <HoverImage src={aragon} hoverSrc={aragonhover} alt='Aragon Nest'/>
    </a>
    <a href='https://beta.giveth.io/campaigns/5b44b198647f33526e67c262' target='_blank' rel="noopener noreferrer">
      <HoverImage src={giveth} hoverSrc={givethhover} alt='Giveth'/>
    </a>
  </div>
)

// Export supports section.
export default Supports
