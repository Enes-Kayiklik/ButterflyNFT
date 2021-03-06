require("@nomiclabs/hardhat-waffle");
const PRIVATE_KEY = "YOUR_PRIVATE_KEY"

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.4",
  networks: {
    avalanche_fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
};
