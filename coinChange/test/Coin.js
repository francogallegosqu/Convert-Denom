const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers")
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs")
const { expect } = require("chai")

describe("Coin", function () {
    async function deployOneCoin() {
        const [owner, otherAccount] = await ethers.getSigners()
        const arrayCoins = [1,5,10,20,50,100]
        const arrayCounts = [5,5,6,5,1,5]
        const Coin = await ethers.getContractFactory("Coin")
        const Token1Peso = await ethers.getContractFactory("Token1Peso")
        const token = await Token1Peso.deploy()
        const coin = await Coin.deploy(arrayCoins,arrayCounts,token.address)

        return { coin, owner, otherAccount }
    }
    describe("Deployment Coin", function () {
        it("Should set the right owner", async function () {
            const { coin, owner } = await loadFixture(deployOneCoin)

            expect(await coin.owner()).to.equal(owner.address)
        })
        it("change coin", async function () {
            const { coin, owner, otherAccount } = await loadFixture(deployOneCoin)
            const testCoins = [ethers.BigNumber.from(50), ethers.BigNumber.from(10), ethers.BigNumber.from(5)]
            const amount = 65
             await coin.connect(owner).changeCoins(amount)
            const coins = await coin.connect(owner).getTypeCoins()
            for (let i = 0; i < coin.length; i++) {
                expect(coins[i]).to.equal(testCoins[i])
            }
        })
        it("convert coin with out of stock", async function () {
            const { coin, owner, otherAccount } = await loadFixture(deployOneCoin)
            const testCoins = [ethers.BigNumber.from(50), ethers.BigNumber.from(5), ethers.BigNumber.from(5),ethers.BigNumber.from(5)]
            const amount = 65
            await coin.connect(owner).changeCoins(amount)
            await coin.connect(owner).changeCoins(amount)
            const coins = await coin.connect(owner).getTypeCoins()
            for (let i = 0; i < coin.length; i++) {
                expect(coins[i]).to.equal(testCoins[i])
            }
        })
        it("convert coin updating stock",async function(){
            const { coin, owner, otherAccount } = await loadFixture(deployOneCoin)
            const testCoins = [ethers.BigNumber.from(50), ethers.BigNumber.from(10), ethers.BigNumber.from(5)]
            const amount = 65
            const newCoins = [5,5,6,1,5,1]
            await coin.connect(owner).changeCoins(amount)
            await coin.connect(owner).changeStock(newCoins)
            await coin.connect(owner).changeCoins(amount)
            const coins = await coin.connect(owner).getTypeCoins()
            for (let i = 0; i < coin.length; i++) {
                expect(coins[i]).to.equal(testCoins[i])
            }
        })
        it("update stock for admin",async function(){
            const { coin, owner, otherAccount } = await loadFixture(deployOneCoin)
            const newStock = [5,5,6,1,5,1]
            const testStock = [ethers.BigNumber.from(5), ethers.BigNumber.from(5), ethers.BigNumber.from(6),ethers.BigNumber.from(1),ethers.BigNumber.from(5),ethers.BigNumber.from(1)]
            await coin.connect(owner).changeStock(newStock)
            const stock = await coin.connect(owner).stock()
            for (let i = 0; i < stock.length; i++) {
                expect(stock[i]).to.equal(testStock[i])
            }
        })
        it("update stock for not admin",async function(){
            const { coin, owner, otherAccount } = await loadFixture(deployOneCoin)
            const newStock = [5,5,6,1,5,1]
            await expect(coin.connect(otherAccount).changeStock(newStock)).to.be.reverted;
        })
    })
})