<template>
  <div class="container">
    <b-row class="m-2 d-flex justify-content-center">
      <b-col
        cols="6"
        style="height:400px"
      >
        <b-row class="m-1">
          <h1>Connect Metamask</h1>
        </b-row>
        <b-row class="m-1">

          <b-button

            variant="primary"
            @click="openMetamask"
          >
            Connect
          </b-button>
        </b-row>
        <b-row class="m-1 ">
          <b-col class="mr-0">
            <b-button

              variant="success"
              @click="convertDenom"
            >
              Convert Denom
            </b-button>
          </b-col>
          <b-col>
            <b-select
              v-model="denom"
              :options="[65,98,431]"
            />
          </b-col>
        </b-row>

        <b-row class="m-1">
          <b-button

            variant="success"
            @click="typeCoin"
          >
            Get Type Coins
          </b-button>
          {{ typeCoins }}
        </b-row>
        <b-row class="m-1">

          <b-button @click="getTokenByCoins">
            Send Token to my wallet
          </b-button>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
// Import Contract
import { ethers } from 'ethers'
import Coin from '../contract/Coin'
// import Token from '../contract/Token'

export default {
  data() {
    return {
      value: 'Hola mundo',
      denom: '',
      typeCoins: [],
    }
  },
  methods: {
    ...mapActions('home', ['INSERT_ETHEREUM']),
    async openMetamask() {
      if (typeof window.ethereum !== 'undefined') {
        const account = await window.ethereum.request({ method: 'eth_requestAccounts' })
        console.log('account', account)
        // this.INSERT_ETHEREUM(account[0])
      } else {
        console.log('Metamask need be installed')
      }
    },
    async convertDenom() {
      if (this.denom !== '') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(Coin.address, Coin.abi, signer)
        await contract.changeCoins(this.denom)
      }
    },
    async typeCoin() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(Coin.address, Coin.abi, signer)
      const data = await contract.getTypeCoins()
      const data2 = data.map(element => Number(element))
      this.typeCoins = data2
    },
    async getTokenByCoins() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(Coin.address, Coin.abi, signer)
      await contract.transferToken()
    },
    async insertStock() {
      try {
        const stock = [5, 5, 6, 5, 1, 5]
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(Coin.address, Coin.abi, signer)
        await contract.changeStock(stock)
      } catch (error) {
        alert('only admin can update stock')
      }
    },
  },
}
</script>
