import axios from "axios";
import common from "./common.js";

const state = () => ({
  data: [],
});

// getters
const getters = {
  url(state, getters, rootState) {
    return rootState.server + "/rest/asset/";
  },
};
// mutations
const mutations = {
  dumpData(state, records) {
    if (records.length > 0) {
      state.data = [];
      common.dumpData(state.data, records);
    } else {
      this.commit("asset/create");
    }
  },
  create(state) {
    common.create(state.data, {
      id: -new Date().valueOf(),
      date: new Date().toISOString().split("T")[0],
      accountId: -1,
      amount: undefined,
    });
  },
  edit(state, { id, field, value }) {
    common.edit(state.data, { id, field, value });
  },
  remove(state, id) {
    common.remove(state.data, id);
    if (state.data.length == 0) {
      this.commit("asset/create");
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
    var asset = state.data.find((a) => a.id == id);
    if (asset) {
      if (asset.accountId == -1) {
        commit(
          "pushMessage",
          { type: "error", text: "请选择账户" },
          { root: true }
        );
        return;
      } else if (
        !asset.amount ||
        asset.amount.search(/^[0-9\.\+\-\*\/]+$/) < 0
      ) {
        commit(
          "pushMessage",
          { type: "error", text: "请输入金额" },
          { root: true }
        );
        return;
      }

      axios
        .post(
          getters.url,
          Object.assign(asset, { method: "save" }),
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
    var asset = state.data.find((a) => a.id == id);
    if (asset) {
      if (asset.id < 0) {
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
