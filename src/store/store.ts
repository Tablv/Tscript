import Vue from "vue";
import Vuex from "vuex";

import common from "@/store/modules/common";
import editor from "@/store/modules/editor";

// 启用 Vuex
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    common,
    editor
  }
});
