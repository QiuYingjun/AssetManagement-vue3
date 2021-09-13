import { createStore } from "vuex";
import asset from "./modules/asset";
import account from "./modules/account";
import axios from "axios";
const store = createStore({
  modules: {
    asset,
    account,
  },
  state: {
    totals: [],
    connecting: [false, false],
  },
  mutations: {
    updateTotal(state, data) {
      state.totals = data;
    },
    updateConnecting(state, data) {
      state.connecting = [state.connecting[1], data];
    },
  },
  getters: {},
  actions: {
    getTotal: function (store) {
      axios.get("/rest/").then((response) => {
        store.commit("updateTotal", response.data);
      });
    },
    getConnecting: function (store) {
      axios
        .get("/rest/ping/", { timeout: 2000 })
        .then((response) => {
          console.log("ping");
          store.commit("updateConnecting", true);
        })
        .catch((e) => {
          console.log("ping不到");
          store.commit("updateConnecting", false);
        });
    },
  },
});
export default store;
