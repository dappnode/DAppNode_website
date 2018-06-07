import React, { Component } from "react";
import "./App.css";

import { css } from "glamor";

import Web3 from "web3";

import Emojify from "react-emojione";

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
        "flex-wrap": "wrap"
      }
    });

    const hiddenOnMobile = css({
      "@media(max-width: 700px)": {
        display: "none"
      }
    });

    const maxOnMobile = css({
      "@media(max-width: 700px)": {
        "max-width": "100%"
      }
    });

    return (
      <div className="App container-fluid">
        <div
          {...responsiveness}
          className="flex-row d-flex justify-content-around header"
        >
          <img
            src="/img/dappnode-logo.svg"
            className="typelogo img-fluid"
            alt="DAppNode Logo"
          />

          <div {...responsiveness} id="intro-text" className="flex-row d-flex">
            <div class="media">
              <div class="media-body">
                <h5 class="mt-0">Goal</h5>
                The goal of DAppNode is to make it easy for users to run their
                own personalized nodes and choose the DApps that run on top of
                it. Nodes can connect to each other and form a decentralized
                network.
              </div>
            </div>
            <div class="media">
              <FontAwesome
                class="mr-3"
                name="ethereum"
                alt="Generic placeholder image"
              />
              <div class="media-body">
                <h5 class="mt-0">Technology</h5>
                DAppNode is available as a linux image - ready for install on
                any pc, server or virtual machine. It creates an Ethereum node
                and offers easy deployment of DApps on top of your node.
              </div>
            </div>
          </div>
        </div>

        <div {...responsiveness} className="flex-row d-flex middleBlock">
          <ol
            {...maxOnMobile}
            id="block"
            className="flex-row d-flex blockColumn justify-content-around"
          >
            <li {...maxOnMobile} className="card text-center">
              <div className="card-header">
                <FontAwesome name="github" size="5x" />
              </div>
              <div className="card-body">
                <div className="card-text">
                  DAppNode is currently in open-source development on{" "}
                  <a href="https://github.com/dappnode">Github</a>
                </div>
              </div>
            </li>
            <li {...maxOnMobile} className="card text-center">
              <div className="card-header">
                <FontAwesome name="download" size="5x" />
              </div>
              <div className="card-body">
                <div className="card-text">
                  Try it yourself!{" "}
                  <a
                    href="https://github.com/dappnode/Dappnode/wiki/DappNode-Installation-Guide"
                    className="btn btn-warning"
                  >
                    Install
                  </a>
                </div>
              </div>
            </li>
            <li {...maxOnMobile} className="card text-center">
              <div className="card-header">
                <img
                  src="/img/giveth-logo-black.svg"
                  className="icon"
                  alt="Giveth Logo"
                />
              </div>
              <div className="card-body">
                <div className="card-text">
                  Transparently tracking contributor payouts via a campaign on{" "}
                  <a href="https://alpha.giveth.io/campaigns/OcKJryNwjeidMXi9">
                    Giveth <strong>Alpha</strong>
                  </a>
                </div>
              </div>
            </li>
            <li {...maxOnMobile} className="card text-center">
              <div className="card-header">
                <FontAwesome name="wikipedia-w" size="5x" />
              </div>
              <div className="card-body">
                <div className="card-text">
                  For more details, please visit the{" "}
                  <a href="https://github.com/dappnode/DAppNode/wiki">Wiki</a>
                </div>
              </div>
            </li>
            <li {...maxOnMobile} className="card text-center">
              <div className="card-header">
                <img
                  src="/img/riot-logo.svg"
                  className="icon"
                  alt="Riot.im logo"
                />
              </div>
              <div className="card-body">
                <div className="card-text">
                  Talk to us on{" "}
                  <a
                    href="https://riot.im/app/#/room/#DAppNode:matrix.org"
                    className="btn btn-warning"
                  >
                    Riot.im
                  </a>
                </div>
              </div>
            </li>
            <li {...maxOnMobile} className="card text-center">
              <div className="card-header">
                <FontAwesome name="heart" size="5x" />
              </div>
              <div className="card-body">
                <div className="card-text">
                  By donating to this project, you directly fund the development
                  of DAppNode.
                </div>
              </div>
            </li>
          </ol>

          <div
            {...maxOnMobile}
            className="flex-column justify-content-center donationColumn"
          >
            <img
              src="/img/ways-to-donate.svg"
              className="img-fluid typelogo-donate"
              alt=""
            />
            {candonate ? (
              <div>
                <h6 {...hiddenOnMobile}>
                  Publicly: Send a transaction via Metamask with your Team Name
                  as a message{" "}
                </h6>

                <form {...hiddenOnMobile} onSubmit={this.handleDonate}>
                  <input
                    type="text"
                    placeholder="ETH to donate"
                    name="amount"
                  />
                  <input type="text" placeholder="Message" name="message" />
                  <button className="btn btn-warning">Send</button>
                </form>
              </div>
            ) : (
              <br />
            )}
            <hr />
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

        <div {...responsiveness} className="flex-row d-flex amount">
          <div className="flex-column margin">
            <strong>Amount donated </strong>
            <h3>{this.state.totalAmount} ETH</h3>
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
      </div>
    );
  }; // End of render()
} // End of class App extends Component

export default App;
