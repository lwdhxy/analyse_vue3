import Vue from 'vue'
import Vuex from 'vuex'
import mutations from "./mutations";
import state from "./state";
import actions from "./actions";
import getters from "./getters";
Vue.use(Vuex)

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
  }
})
