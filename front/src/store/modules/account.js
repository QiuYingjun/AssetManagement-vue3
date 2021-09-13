import axios from "axios";
// initial state
const state = () => ({
  data: [],
});

// getters
const getters = {};
// mutations
const mutations = {
  dumpData(state, data) {
    state.data = data;
  },
};
// actions
const actions = {
  getData: function ({ commit }) {
    axios.get("/rest/account/").then((response) => {
      commit("dumpData", response.data);
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
