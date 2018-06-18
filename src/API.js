import Web3 from "web3";

const web3 = new Web3(
  Web3.givenProvider || "https://mainnet.infura.io/metamask"
);

const blockExplorerLink = "https://etherscan.io/tx/";

const leaderboardAddr = "0x00cf36853aa4024fb5bf5cc377dfd85844b411a0";
const deploymentBlock = 5350316;
const leaderboardAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "sender", type: "address" },
      { indexed: false, name: "value", type: "uint256" }
    ],
    name: "Deposit",
    type: "event"
  }
];

const leaderboard = new web3.eth.Contract(leaderboardAbi, leaderboardAddr);

function getPastDonations() {
  return leaderboard
    .getPastEvents("Deposit", {
      // filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'}, // Using an array means OR: e.g. 20 or 23
      fromBlock: deploymentBlock,
      toBlock: "latest"
    })
    .then(ParseEvents);
}

function getBalance() {
  return web3.eth
    .getBalance(leaderboardAddr)
    .then(balanceWei => web3.utils.fromWei(balanceWei, "ether"));
}

function ParseEvents(events) {
  return Promise.all(
    events.map(tx =>
      web3.eth.getTransaction(tx.transactionHash).then(txData => {
        return {
          address: txData.from,
          value: web3.utils.fromWei(txData.value, "ether"),
          message: txData.input.length
            ? web3.utils.hexToAscii(txData.input)
            : "",
          link: blockExplorerLink + txData.hash
        };
      })
    )
  );
}

function subscribeToDonations(callback) {
  leaderboard.events
    .Deposit({
      fromBlock: "latest"
    })
    .on("data", callback);
}

export default {
  getPastDonations,
  subscribeToDonations,
  getBalance
};
