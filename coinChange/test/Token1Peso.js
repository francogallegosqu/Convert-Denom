const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers")
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs")
const { expect } = require("chai")

describe("Token", function () {
    async function deployTwoContract() {
        const [owner, otherAccount, thirdAccount] = await ethers.getSigners()
        const arrayCoins = [1,5,10,20,50,100]
        const arrayCounts = [5,5,6,5,1,5]
        const Coin = await ethers.getContractFactory("Coin")
        const Token1Peso = await ethers.getContractFactory("Token1Peso")
        const token = await Token1Peso.deploy()
        const coin = await Coin.deploy(arrayCoins,arrayCounts,token.address)
        

        return { coin, owner, otherAccount,token,thirdAccount }
    }
    describe("Deployment Token", function () {
        it('Should assign the total supply of tokens to the owner', async () => {
            const { coin, owner,token } = await loadFixture(deployTwoContract)
            const ownerBalance = await token.balanceOf(owner.address)
            expect(await token.totalSupply()).to.equal(ownerBalance)
          })
        it('pay with token',async function(){
            const { coin, owner, otherAccount,thirdAccount,token } = await loadFixture(deployTwoContract)
            const amount = 65
            const balance = ethers.utils.parseUnits('100000', 'ether')
            await coin.connect(otherAccount).changeCoins(amount)
            await coin.connect(otherAccount).getTypeCoins()
            // Add balance to Contract Coin
            await token.transfer(coin.address,balance)
            const balanceCoin = await token.balanceOf(coin.address)
            expect(balanceCoin).to.equal(balance)
            // Transfer Token of 5 pesos
            await coin.connect(otherAccount).transferToken()
            const balanceOther = await token.balanceOf(otherAccount.address)
            console.log("[balance other acc]",balanceOther)
            
        })

    })
})