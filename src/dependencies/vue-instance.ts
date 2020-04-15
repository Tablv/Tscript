import Vue, { Component } from "vue";
import store from "@/store/store";

// 关闭生产提示
Vue.config.productionTip = false;

export function newVue(
  module: Component<any, any, any, any>,
  elementOrSelector: HTMLElement | string
) {
  new Vue({
    store,
    render: h => h(module)
  }).$mount(elementOrSelector);
}
