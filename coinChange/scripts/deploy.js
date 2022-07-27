// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const arrayCoins = [1,5,10,20,50,100]
  const arrayCounts = [5,5,6,5,1,5]

  const Coin = await hre.ethers.getContractFactory("Coin")
  const Token1Peso = await hre.ethers.getContractFactory("Token1Peso")
  const token = await Token1Peso.deploy()
  const coin = await Coin.deploy(arrayCoins,arrayCounts,token.address)

  await token.deployed()
  await coin.deployed()

  console.log("Token 1 Peso :", token.address);
  console.log("Contract Coin :", coin.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
