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
    server: "http://127.0.0.1:5000"
  },
  mutations: {
    updateTotal(state, data) {
      state.totals = data;
    },
    updateConnecting(state, data) {
      state.connecting = [state.connecting[1], data];
    },
    updateServer(state, data) {
      state.server = data;
      state.connecting = [state.connecting[1], false];
    }
  },
  getters: {},
  actions: {
    getTotal: function ({commit, state}) {
      axios.get(state.server + "/rest/").then((response) => {
        commit("updateTotal", response.data);
      });
    },
    getConnecting: function ({commit, state}) {
      axios
        .get(state.server + "/rest/ping/",
          {
            timeout: 3000,
            headers: {
              "Bypass-Tunnel-Reminder": "a",
            }
          }
        )
        .then((response) => {
          console.log("ping");
          commit("updateConnecting", true);
        })
        .catch((e) => {
          console.log("ping不到");
          commit("updateConnecting", false);
        });
    },
  },
});
export default store;
