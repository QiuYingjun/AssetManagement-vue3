import { createStore } from "vuex";
import asset from "./modules/asset";
import account from "./modules/account";
import fxrate from "./modules/fxrate";
import axios from "axios";
const store = createStore({
  modules: {
    asset,
    account,
    fxrate,
  },
  state: {
    totals: [],
    connecting: [false, false],
    server: "http://127.0.0.1:5000",
    axiosConfig: {
      timeout: 3000,
      headers: {
        "Bypass-Tunnel-Reminder": "a",
        "Access-Control-Allow-Methods": "POST,GET,PUT,DELETE,OPTIONS",
        "User-Agent": "vue",
        // "Access-Control-Allow-Headers": "Authorization, Lang",
      },
    },
    messageQueue: [],
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
      localStorage.setItem("server", state.server);
    },
    removeMessage(state) {
      state.messageQueue.shift();
    },
    pushMessage(state, message) {
      state.messageQueue.push(message);
    },
  },
  getters: {},
  actions: {
    getTotal: function ({ commit, state }) {
      axios.get(state.server + "/rest/", state.axiosConfig).then((response) => {
        commit("updateTotal", response.data);
      });
    },
    getConnecting: function ({ commit, state }) {
      axios
        .get(state.server + "/rest/ping/", state.axiosConfig)
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
