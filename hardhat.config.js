require("@nomiclabs/hardhat-waffle");
const PRIVATE_KEY = "5a8435255d2f11176960fa34770c8b3110f2b294b45b488c2093ef21423ac5ac"

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