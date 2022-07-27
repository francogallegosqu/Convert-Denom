const state = {
  ethereum: null,
}

const getters = {
  currentEther: () => state.ethereum,
}

const mutations = {
  INSERT_ETHEREUM_USER(payload) {
    state.ethereum = payload
  },
}

const actions = {
  INSERT_ETHEREUM({ commit }, payload) {
    commit('INSERT_ETHEREUM_USER', payload)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
