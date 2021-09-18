import axios from "axios";
// initial state
const state = () => ({
  data: [],
});

// getters
const getters = {
  assetUrl(state, getters, rootState) {
    return rootState.server + "/rest/asset/";
  },
};
// mutations
const mutations = {
  dumpData(state, data) {
    var records = [];
    data.forEach((element) => {
      element.edit = false;
      records.push(element);
    });
    records[0].showAdd = true;
    state.data = records;
  },
  create(state) {
    state.data[0].showAdd = false;
    state.data.splice(0, 0, {
      id: -new Date().valueOf(),
      date: new Date().toISOString().split("T")[0],
      accountId: -1,
      amount: undefined,
      edit: true,
      showAdd: true,
    });
  },
  edit(state, { id, field, value }) {
    var record = state.data.find((a) => a.id == id);
    if (record) {
      record[field] = value;
    }
  },
  remove(state, id) {
    state.data = state.data.filter((a) => a.id != id);
    if (state.data[0]) {
      state.data[0].showAdd = true;
    }
  },
};
// actions
const actions = {
  getData: function ({ commit, rootState, getters }) {
    axios.get(getters.assetUrl).then((response) => {
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
      } else if (!asset.amount || asset.amount.search(/^[0-9\+\-\*\/]+$/) < 0) {
        commit(
          "pushMessage",
          { type: "error", text: "请输入金额" },
          { root: true }
        );
        return;
      }

      axios
        .post(
          getters.assetUrl,
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
          .post(
            getters.assetUrl,
            { id, method: "delete" },
            rootState.axiosConfig
          )
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
