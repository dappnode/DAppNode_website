import React, { Component } from "react";
import "./App.css";

import { css } from "glamor";

import Web3 from "web3";

import Emojify from "react-emojione";

import Collapsible from "react-collapsible";

const donationNetworkID = 1; // make sure donations only go through on this network.

const donationAddress = "0x00cf36853aa4024fb5bf5cc377dfd85844b411a0"; //replace with the address to watch
const apiKey = "6DIUB7X6S92YJR6KXKF8V8ZU55IXT5PN2S"; //replace with your own key

const etherscanApiLinks = {
  extTx:
    "https://api.etherscan.io/api?module=account&action=txlistinternal&address=" +
    donationAddress +
    "&startblock=0&endblock=99999999&sort=asc&apikey=" +
    apiKey,
  intTx:
    "https://api.etherscan.io/api?module=account&action=txlist&address=" +
    donationAddress +
    "&startblock=0&endblock=99999999&sort=asc&apikey=" +
    apiKey
};

const isSearched = searchTerm => item =>
  item.from.toLowerCase().includes(searchTerm.toLowerCase());

var myweb3;

var FontAwesome = require("react-fontawesome");

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ethlist: [],
      searchTerm: "",
      donateenabled: true,
      socketconnected: false,
      totalAmount: 0
    };
  }

  onSearchChange = event => {
    this.setState({
      searchTerm: event.target.value
    });
  };

  subscribe = address => {
    let ws = new WebSocket("wss://socket.etherscan.io/wshandler");

    function pinger(ws) {
      var timer = setInterval(function() {
        if (ws.readyState === 1) {
          ws.send(
            JSON.stringify({
              event: "ping"
            })
          );
        }
      }, 20000);
      return {
        stop: function() {
          clearInterval(timer);
        }
      };
    }

    ws.onopen = function() {
      this.setState({
        socketconnected: true
      });
      pinger(ws);
      ws.send(
        JSON.stringify({
          event: "txlist",
          address: address
        })
      );
    }.bind(this);
    ws.onmessage = function(evt) {
      let eventData = JSON.parse(evt.data);
      console.log(eventData);
      if (eventData.event === "txlist") {
        let newTransactionsArray = this.state.transactionsArray.concat(
          eventData.result
        );
        this.setState(
          {
            transactionsArray: newTransactionsArray
          },
          () => {
            this.processEthList(newTransactionsArray);
          }
        );
      }
    }.bind(this);
    ws.onerror = function(evt) {
      this.setState({
        socketerror: evt.message,
        socketconnected: false
      });
    }.bind(this);
    ws.onclose = function() {
      this.setState({
        socketerror: "socket closed",
        socketconnected: false
      });
    }.bind(this);
  };

  getAccountData = () => {
    let fetchCalls = [
      fetch(`${etherscanApiLinks.extTx}`),
      fetch(`${etherscanApiLinks.intTx}`)
    ];
    return Promise.all(fetchCalls)
      .then(res => {
        return Promise.all(res.map(apiCall => apiCall.json()));
      })
      .then(responseJson => {
        return [].concat.apply(...responseJson.map(res => res.result));
      });
  };

  handleDonate = event => {
    event.preventDefault();
    const form = event.target;
    let donateWei = new myweb3.utils.BN(
      myweb3.utils.toWei(form.elements["amount"].value, "ether")
    );
    let message = myweb3.utils.toHex(form.elements["message"].value);
    let extraGas = form.elements["message"].value.length * 68;

    myweb3.eth.net.getId().then(netId => {
      switch (netId) {
        case 1:
          console.log("Metamask is on mainnet");
          break;
        case 2:
          console.log("Metamask is on the deprecated Morden test network.");
          break;
        case 3:
          console.log("Metamask is on the ropsten test network.");
          break;
        case 4:
          console.log("Metamask is on the Rinkeby test network.");
          break;
        case 42:
          console.log("Metamask is on the Kovan test network.");
          break;
        default:
          console.log("Metamask is on an unknown network.");
      }
      if (netId === donationNetworkID) {
        return myweb3.eth.getAccounts().then(accounts => {
          return myweb3.eth
            .sendTransaction({
              from: accounts[0],
              to: donationAddress,
              value: donateWei,
              gas: 150000 + extraGas,
              data: message
            })
            .catch(e => {
              console.log(e);
            });
        });
      } else {
        console.log("no donation allowed on this network");
        this.setState({
          donateenabled: false
        });
      }
    });
  };

  processEthList = ethlist => {
    // let totalAmount = new myweb3.utils.BN(0);
    let filteredEthList = ethlist
      .map(obj => {
        obj.value = new myweb3.utils.BN(obj.value); // convert string to BigNumber
        return obj;
      })
      .filter(obj => {
        return obj.value.cmp(new myweb3.utils.BN(0));
      }) // filter out zero-value transactions
      .reduce((acc, cur) => {
        // group by address and sum tx value
        if (cur.isError !== "0") {
          // tx was not successful - skip it.
          return acc;
        }
        if (cur.from === donationAddress) {
          // tx was outgoing - don't add it in
          return acc;
        }
        if (typeof acc[cur.from] === "undefined") {
          acc[cur.from] = {
            from: cur.from,
            value: new myweb3.utils.BN(0),
            input: cur.input,
            hash: []
          };
        }
        acc[cur.from].value = cur.value.add(acc[cur.from].value);
        acc[cur.from].input =
          cur.input !== "0x" && cur.input !== "0x00"
            ? cur.input
            : acc[cur.from].input;
        acc[cur.from].hash.push(cur.hash);
        return acc;
      }, {});
    filteredEthList = Object.keys(filteredEthList)
      .map(val => filteredEthList[val])
      .sort((a, b) => {
        // sort greatest to least
        return b.value.cmp(a.value);
      })
      .map((obj, index) => {
        // add rank
        obj.rank = index + 1;
        return obj;
      });
    const ethTotal = filteredEthList.reduce((acc, cur) => {
      return acc.add(cur.value);
    }, new myweb3.utils.BN(0));
    return this.setState({
      ethlist: filteredEthList,
      totalAmount: parseFloat(myweb3.utils.fromWei(ethTotal)).toFixed(2)
    });
  };

  componentDidMount = () => {
    if (
      typeof window.web3 !== "undefined" &&
      typeof window.web3.currentProvider !== "undefined"
    ) {
      myweb3 = new Web3(window.web3.currentProvider);
      myweb3.eth.defaultAccount = window.web3.eth.defaultAccount;
      this.setState({
        candonate: true
      });
    } else {
      // I cannot do transactions now.
      this.setState({
        candonate: false
      });
      myweb3 = new Web3();
    }

    this.getAccountData().then(res => {
      this.setState(
        {
          transactionsArray: res
        },
        () => {
          this.processEthList(res);
          this.subscribe(donationAddress);
        }
      );
    });
  };

  render = () => {
    const candonate = this.state.candonate;

    const responsiveness = css({
      "@media(max-width: 700px)": {
        flexWrap: "wrap"
      }
    });

    const hiddenOnMobile = css({
      "@media(max-width: 700px)": {
        display: "none"
      }
    });

    const maxOnMobile = css({
      "@media(max-width: 700px)": {
        maxWidth: "100%"
      }
    });

    return (
      <div className="App container-fluid">
        <div
          {...responsiveness}
          className="flex-row d-flex justify-content-around header"
        >
          <div className="flex-column d-flex">
            <img
              src="/img/dappnode-logo.svg"
              className="typelogo img-fluid"
              alt="DAppNode Logo"
            />

            <div className="flex-column d-flex intro-column">
              <h2>Connect to</h2>
              <h2>the decentralized</h2>
              <h2>Internet</h2>

              <a
                href="https://github.com/dappnode/DAppNode/wiki/DAppNode-Installation-Guide"
                className="btn btn-light"
              >
                INSTALL NOW
              </a>
            </div>
          </div>

          <div
            {...responsiveness}
            id="intro-text"
            className="flex-row d-flex"
          />
        </div>

        <div
          {...responsiveness}
          className="flex-row d-flex justify-content-center"
        >
          <div
            {...responsiveness}
            {...maxOnMobile}
            className="flex-column d-flex content-section"
          >
            <h1>
              What's all this <span className="special">About</span>
            </h1>
            <p>
              <span className="special">
                What happens when you want to use a Decentralized P2P network,<br />{" "}
                but securing your own nodes takes a lot of time and effort?
              </span>
            </p>
            <div
              {...responsiveness}
              {...maxOnMobile}
              className="flex-row d-flex content-text"
            >
              <p>
                You have a decentralization bottleneck at the entry point, which
                is where we are now in the blockchain space :-(
                <br />
                <br />
                <strong>1.</strong> At no point in the last 2 years has there
                been more than <em>13,000</em> Bitcoin nodes online and that
                number got as low as <em>5500</em>
                <br />
                <br />
                <strong>2.</strong> MetaMask and MyEtherWallet/MyCrypto are the
                primary wallets used on Ethereum and most users are using these
                wallets’ default nodes … This is a huge centralizing force in
                Ethereum.
                <br />
                <br />
                <strong>3.</strong> The people who do run their own node end up
                <em> having to spend a lot of time troubleshooting</em>, keeping
                it updated and synced without the ability to easily share their
                node (and efforts) with family and friends.
              </p>
              <p>
                <FontAwesome name="check" className="special" />
                DAppNode will address these issues by creating a simple, easy,
                self-empowering system made specifically for hosting P2P clients
                for DApps, Cryptocurrencies, VPNs, IPFS, and more.
                <br />
                <br />
                <FontAwesome name="check" className="special" />
                Members of the WHG have spent countless hours developing
                DAppNode because they believe it to be the most important and
                pertinent censorship resistant tool that is to be built to help
                bring the decentralized world everyone wants for themselves, and
                their friends and family..
              </p>
            </div>
          </div>
        </div>

        <div
          {...responsiveness}
          className="flex-row d-flex middleBlock justify-content-around"
        >
          <div
            {...maxOnMobile}
            className="flex-column justify-content-center donationColumn"
          >
            <h1>
              Ways to <span className="special">Donate</span>
            </h1>
            <p>
              Development for DAppNode is exclusively done in an open-source
              fashion. You can donate directly to development via MetaMask or
              sending ETH to the donation address.
            </p>
            {candonate ? (
              <div>
                <h6 {...hiddenOnMobile}>
                  Publicly: Send a transaction via Metamask with your Name as a
                  message{" "}
                </h6>

                <form {...hiddenOnMobile} onSubmit={this.handleDonate}>
                  <input
                    type="text"
                    placeholder="ETH to donate"
                    name="amount"
                  />
                  <input type="text" placeholder="Message" name="message" />
                  <button className="btn btn-light">Send</button>
                </form>
              </div>
            ) : (
              <br />
            )}
          </div>
          <div
            {...maxOnMobile}
            className="flex-column justify-content-center donationColumn"
          >
            <h6>Privately: Send directly to the donation address</h6>
            <img
              src="/img/dappnode-qr.svg"
              className="qr-code"
              alt="Donation QR Code"
            />
            <div className="word-wrap">
              <strong className="color-main-accent">{donationAddress}</strong>
            </div>
          </div>
        </div>

        <div {...responsiveness} className="flex-row d-flex amount bg-blue">
          <div className="flex-column margin">
            <strong>Amount donated </strong>
            <h3 className="color-main-accent">{this.state.totalAmount} ETH</h3>
          </div>
          <div className="flex-column margin">
            <form className="Search">
              <input
                type="text"
                onChange={this.onSearchChange}
                placeholder="filter leaderboard"
              />
            </form>
          </div>
        </div>

        <div className="flex-row d-flex bg-blue justify-content-center">
          <Collapsible trigger="Show the leaderboard">
            <div className="flex-column leaderboard">
              <table className="table">
                <thead className="pagination-centered">
                  <tr>
                    <th>Rank</th>
                    <th>Address</th>
                    <th>Value</th>
                    <th>Message</th>
                    <th>Tx Link</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.ethlist
                    .filter(isSearched(this.state.searchTerm))
                    .map(item => (
                      <tr key={item.hash} className="Entry">
                        <td>{item.rank} </td>
                        <td>{item.from} </td>
                        <td>{myweb3.utils.fromWei(item.value)} ETH</td>
                        <td>
                          <Emojify>
                            {item.input.length &&
                              myweb3.utils.hexToAscii(item.input)}
                          </Emojify>
                        </td>
                        <td>
                          {item.hash.map((txHash, index) => (
                            <a
                              key={index}
                              href={"https://etherscan.io/tx/" + txHash}
                            >
                              [{index + 1}]
                            </a>
                          ))}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Collapsible>
        </div>

        <div
          {...responsiveness}
          className="flex-row d-flex justify-content-center bg-light-grey"
        >
          <div
            {...responsiveness}
            className="flex-column d-flex content-section"
          >
            <h1>
              Benefits of <span className="special">DAppNode</span>
            </h1>
            <p>
              <span className="special">
                What happens when you want to use a Decentralized P2P network,<br />{" "}
                but securing your own nodes takes a lot of time and effort?
              </span>
            </p>
            <div {...responsiveness} className="flex-row d-flex content-text">
              <ul>
                <li>
                  <FontAwesome name="check" className="special" /> Easy set up
                </li>
                <li>
                  <FontAwesome name="check" className="special" /> Trustless
                  system
                </li>
                <li>
                  <FontAwesome name="check" className="special" /> Invitingly
                  Open Source
                </li>
                <li>
                  <FontAwesome name="check" className="special" /> Free up space
                  on your Devices
                </li>
                <li>
                  <FontAwesome name="check" className="special" /> Great for
                  proof of stake mining
                </li>
                <li>
                  <FontAwesome name="check" className="special" /> You can
                  browse .eth domains like the normal web
                </li>
                <li>
                  <FontAwesome name="check" className="special" /> You take
                  control of your Nodes
                </li>
                <li>
                  <FontAwesome name="check" className="special" /> Encourages
                  people to have their own server
                </li>
                <li>
                  <FontAwesome name="check" className="special" /> Perfect for
                  projects that reward you for hosting, (Filecoin, Mysterium,
                  etc)
                </li>
                <li>
                  <FontAwesome name="check" className="special" /> Can
                  facilitate a P2P economy
                </li>
              </ul>
              <ul>
                <li>
                  <FontAwesome name="check" className="special" /> Host any P2P
                  networking protocols
                </li>
                <li>
                  <FontAwesome name="check" className="special" /> DApp teams
                  can develop packages their users can run 24x7
                </li>
                <li>
                  <FontAwesome name="check" className="special" /> Never trust a
                  hosting provider with your private keys again!
                </li>
                <li>
                  <FontAwesome name="check" className="special" /> One click
                  node deployment (Full Nodes, DApps)
                </li>
                <li>
                  <FontAwesome name="check" className="special" /> Censorship
                  resistance (run your own VPN)
                </li>
                <li>
                  <FontAwesome name="check" className="special" /> 1 DAppNode
                  can support an entire Community
                </li>
                <li>
                  <FontAwesome name="check" className="special" /> DAppNode will
                  build communities and decrease centralization
                </li>
                <li>
                  <FontAwesome name="check" className="special" /> DAppNode is
                  the most important piece of infrastructure for our
                  decencentralized future
                </li>
                <li>
                  <FontAwesome name="check" className="special" /> Considering
                  all of the incentive structures to to run nodes, most DAppNode
                  Admins will be make a profit maintaining their own DAppNode
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          {...responsiveness}
          className="flex-row d-flex justify-content-center"
        >
          <div
            {...responsiveness}
            className="flex-column d-flex content-section"
          >
            <h1>
              <span className="special">Team </span>members
            </h1>
            <p>
              <span className="special">
                These fine individuals are responsible<br /> for most of the
                work
              </span>
            </p>

            <ol
              {...maxOnMobile}
              id="block"
              className="flex-row d-flex justify-content-center"
            >
              <li {...maxOnMobile} className="card text-center">
                <div className="card-header">
                  <img src="/img/team/jordi.jpeg" className="icon" alt="" />
                </div>
                <div className="card-body">
                  <div className="card-text">
                    Jordi Baylina <br />
                    <em>Advisor and Instigator</em>
                  </div>
                </div>
              </li>
              <li {...maxOnMobile} className="card text-center">
                <div className="card-header">
                  <img src="/img/team/edu.jpg" className="icon" alt="" />
                </div>
                <div className="card-body">
                  <div className="card-text">
                    Eduadiez <br />
                    <em>Project Lead</em>
                  </div>
                </div>
              </li>
              <li {...maxOnMobile} className="card text-center">
                <div className="card-header">
                  <img src="/img/team/dapplion.png" className="icon" alt="" />
                </div>
                <div className="card-body">
                  <div className="card-text">
                    DAppLion <br />
                    <em>Front-End Lead</em>
                  </div>
                </div>
              </li>
              <li {...maxOnMobile} className="card text-center">
                <div className="card-header">
                  <img src="/img/team/yalor.jpg" className="icon" alt="" />
                </div>
                <div className="card-body">
                  <div className="card-text">
                    Yalor <br />
                    <em>Comms</em>
                  </div>
                </div>
              </li>
              <li {...maxOnMobile} className="card text-center">
                <div className="card-header">
                  <img src="/img/team/griff.jpeg" className="icon" alt="" />
                </div>
                <div className="card-body">
                  <div className="card-text">
                    Griff Green <br />
                    <em>Advisor</em>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        </div>

        <div
          {...responsiveness}
          className="flex-row d-flex justify-content-around bg-blue"
        >
          <span className="align-baseline">
            <strong className="learn-more">Learn more about DAppNode:</strong>
            <a
              href="https://github.com/dappnode/DAppNode/wiki"
              className="btn btn-outline-light"
            >
              DAppNode Wiki
            </a>
          </span>
        </div>

        <div
          {...responsiveness}
          className="flex-row d-flex justify-content-around footer bg-light-grey"
        >
          <div className="flex-column d-flex justify-content-center">
            <img
              src="/img/dappnode-logo-blackface.svg"
              className="typelogo img-fluid"
              alt="DAppNode Logo"
            />
            <div className="flex-row">
              <ul className="flex-row d-flex justify-content-center">
                <li>
                  <a href="https://github.com/dappnode">
                    <FontAwesome name="github" className="special" size="3x" />
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/dappnode">
                    <FontAwesome name="twitter" className="special" size="3x" />
                  </a>
                </li>
                <li>
                  <a href="https://riot.im/app/#/room/#DAppNode:matrix.org">
                    <FontAwesome
                      name="comments"
                      className="special"
                      size="3x"
                    />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex-column d-flex justify-content-center">
            <img
              src="/img/logo-purple-fill.png"
              className="icon icon-bottom"
              alt="Giveth Logo"
            />
            <div>
              DAppNode is using{" "}
              <a href="https://alpha.giveth.io/campaigns/OcKJryNwjeidMXi9">
                Giveth <strong>Alpha</strong>
              </a>{" "}
              <br /> to transparently track contributor payouts
            </div>
          </div>
        </div>

        <div className="flex-column d-flex justify-content-center align-content-middle bg-blue last-section">
          <span>
            <strong className="copyright">
              <FontAwesome name="copyright" className="special" /> 2018 - All
              Rights Reserved
            </strong>
          </span>
        </div>
      </div> // End of App
    );
  }; // End of render()
} // End of class App extends Component

export default App;
