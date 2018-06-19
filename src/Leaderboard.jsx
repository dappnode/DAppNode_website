import React, { Component } from "react";
import API from "./API";
import Emojify from "react-emojione";

// Copy paste the contract address and ABI

export default class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ethlist: []
    };
    this.getDonations = this.getDonations.bind(this);
  }

  getDonations() {
    API.getPastDonations().then(ethlist => {
      this.setState({ ethlist });
    });
  }

  componentDidMount = () => {
    this.getDonations();
    API.subscribeToDonations(() => {
      this.getDonations();
    });
  };

  render() {
    const rows = this.state.ethlist
      .sort((a, b) => b.value - a.value)
      .map((tx, i) => {
        const linkList = tx.links.map((link, j) => (
          <a href={link}>[{j + 1}]</a>
        ));
        return (
          <tr key={i} className="Entry">
            <td>{i + 1} </td>
            <td>{tx.address} </td>
            <td>{tx.value} ETH</td>
            <td>
              <Emojify>{tx.message}</Emojify>
            </td>
            <td>{linkList}</td>
          </tr>
        );
      });

    return (
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
        <tbody>{rows}</tbody>
      </table>
    );
  }
}
