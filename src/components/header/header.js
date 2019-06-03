import React from 'react'
import AnchorLink from 'react-anchor-link-smooth-scroll'

import links from '../../links.json'
import logo from '../../images/dappnode.png'
import './main.css'

class Header extends React.Component {
  state = { showMenu: false }

  toggleMenu = () => {
    this.setState({
      showMenu: !this.state.showMenu
    })
  }

  render() {
    const menuVis = this.state.showMenu ? 'showMenu' : 'hideMenu';
    return(
      <div className='section header' id='headerAnchor'>
        <div>
          <div>
            <img src={logo} alt='DAppNode logo' />
          </div>
          <div>
            <ul>
              <li><a href={links.install} className='install' target='_blank' rel="noopener noreferrer">Install</a></li>
              <li><a href={links.shop} className='docs' target='_blank' rel="noopener noreferrer">Shop</a></li>
              <li><a href={links.docs} target='_blank' rel="noopener noreferrer">Documentation</a></li>
              <li><AnchorLink href='#aboutAnchor'>About</AnchorLink></li>
              <li><AnchorLink href='#headerAnchor'>Home</AnchorLink></li>
            </ul>
          </div>
          <div className='mobileMenu' onClick={this.toggleMenu}>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className={`mobileLinks ${menuVis}`}>
            <ul>
              <li><AnchorLink href='#headerAnchor' onClick={this.toggleMenu}>Home</AnchorLink></li>
              <li><AnchorLink href='#aboutAnchor' onClick={this.toggleMenu}>About</AnchorLink></li>
              <li><a href={links.docs} target='_blank' rel="noopener noreferrer">Documentation</a></li>
              <li><AnchorLink href='#communityAnchor' onClick={this.toggleMenu}>Community</AnchorLink></li>
              <li>
                <a href={links.shop} style={{ marginRight: "1rem" }} className='docs' target='_blank' rel="noopener noreferrer">Shop</a>
                <a href={links.install} className='install' target='_blank' rel="noopener noreferrer">Install</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Header
