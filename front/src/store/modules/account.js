import axios from "axios";
import common from "./common.js";
// initial state
const state = () => ({
  data: [],
});

// getters
const getters = {
  url(state, getters, rootState) {
    return rootState.server + "/rest/account/";
  },
};
// mutations
const mutations = {
  dumpData(state, records) {
    if (records.length > 0) {
      state.data = [];
      common.dumpData(state.data, records);
    } else {
      this.commit("account/create");
    }
  },
  create(state) {
    common.create(state.data, {
      id: -new Date().valueOf(),
      name: null,
      currency: "JPY",
      is_active: true,
    });
  },
  edit(state, { id, field, value }) {
    common.edit(state.data, { id, field, value });
  },
  remove(state, id) {
    common.remove(state.data, id);
    if (state.data.length == 0) {
      this.commit("account/create");
    }
  },
};
// actions
const actions = {
  getData: function ({ commit, getters, rootState }) {
    axios.get(getters.url, rootState.axiosConfig).then((response) => {
      commit("dumpData", response.data);
    });
  },
  saveData: function ({ commit, state, getters, rootState }, id) {
    var account = state.data.find((a) => a.id == id);
    if (account) {
      if (!account.name || !account.currency) {
        commit(
          "pushMessage",
          { type: "error", text: "请输入账户名和货币" },
          { root: true }
        );
        return;
      }

      axios
        .post(
          getters.url,
          Object.assign(account, { method: "save" }),
          rootState.axiosConfig
        )
        .then((response) => {
          commit("dumpData", response.data);
          commit(
            "pushMessage",
            { type: "success", text: "保存成功！" },
            { root: true }
          );
        })
        .catch((e) => {
          commit(
            "pushMessage",
            { type: "error", text: "" + e },
            { root: true }
          );
        });
    } else {
      commit("pushMessage", { type: "error", text: "无效id" }, { root: true });
    }
  },

  deleteData: function ({ commit, state, getters, rootState }, id) {
    var account = state.data.find((a) => a.id == id);
    if (account) {
      if (account.id < 0) {
        commit("remove", id);
      } else {
        axios
          .post(getters.url, { id, method: "delete" }, rootState.axiosConfig)
          .then((response) => {
            commit("dumpData", response.data);
            commit(
              "pushMessage",
              { type: "success", text: "删除成功！" },
              { root: true }
            );
          })
          .catch((e) => {
            commit(
              "pushMessage",
              { type: "error", text: "" + e },
              { root: true }
            );
          });
      }
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
