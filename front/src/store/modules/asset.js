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
    var records = [];
    var b = true;
    data.forEach((element) => {
      element.showAdd = b;
      if (b) {
        b = false;
      }
      element.edit = false;
      records.push(element);
    });
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
};
// actions
const actions = {
  getData: function ({ commit, rootState }) {
    axios.get(rootState.server + "/rest/asset/").then((response) => {
      commit("dumpData", response.data);
    });
  },
  postData: function ({ state }) {},
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
