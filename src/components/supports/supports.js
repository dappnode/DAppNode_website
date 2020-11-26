// Base imports.
import React from 'react'
import './main.css'

// Import png's
import europeanUnionLogo from '../../images/eu.png'
import blockisLogo from '../../images/blockis.png'
import ngiTrustLogo from '../../images/ngiTrust.png'

// Import seperate images (non-hover color).
import efLogo from '../../images/vectors/ef.svg'
import aragonLogo from '../../images/vectors/nest.svg'
import givethLogo from '../../images/vectors/giveth.svg'
import ecfLogo from '../../images/vectors/ecf.svg'

const newTabProps = { target: '_blank', rel: 'noopener noreferrer' }
const supportersSvgLogos = [
  {
    alt: 'Ethereum Foundation',
    src: efLogo,
    href:
      'https://blog.ethereum.org/2018/08/17/ethereum-foundation-grants-update-wave-3/',
  },
  {
    alt: 'Ethereum Community Fund',
    src: ecfLogo,
    href: 'https://ecf.network/',
  },
  {
    alt: 'Aragon Nest',
    src: aragonLogo,
    href:
      'https://blog.aragon.org/aragon-nest-second-round-of-grants/#dappnode',
  },
  {
    alt: 'Giveth',
    src: givethLogo,
    href: 'https://beta.giveth.io/campaigns/5b44b198647f33526e67c262',
  },
]
const supportersPng = [
  {
    alt: 'European Union',
    src: europeanUnionLogo,
    href: 'https://ec.europa.eu/',
  },
  {
    alt: 'Block IS',
    src: blockisLogo,
    href: 'https://blockis.eu/',
  },
  {
    alt: 'NGI trust',
    src: ngiTrustLogo,
    href: 'https://www.ngi.eu/ngi-projects/ngi-trust/',
  },
]

// Declare supports section.
const Supports = () => (
  <div className="section supports">
    <div className="p-wrapper">
      <p>Supported through grants and funds from: </p>
    </div>

    {supportersSvgLogos.map(({ alt, src, href }) => (
      <a href={href} {...newTabProps}>
        <img src={src} alt={alt} className="svg-logo" />
      </a>
    ))}

    <br />

    {supportersPng.map(({ alt, src, href }) => (
      <a href={href} {...newTabProps}>
        <img src={src} alt={alt} />
      </a>
    ))}

    <div className="p-wrapper">
      <p className="european-union-bottom-text">
        This project has received funding from the European Union’s Horizon 2020
        research and innovation programme under the NGI_TRUST grant agreement no
        825618, and indirectly received funding from the European Union’s
        Horizon 2020 research and innovation programme under project Block.IS
        (grant agreement No 824509).
      </p>
    </div>
  </div>
)

// Export supports section.
export default Supports
