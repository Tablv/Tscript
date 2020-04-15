import Vue from "vue";
import { newVue } from "@/dependencies/vue-instance";
import Validate from "./validate.vue";

// CSS
import "font-awesome/css/font-awesome.min.css";
import "animate.css";

// Element-UI
import "@/dependencies/element-ui.js";

// 原型挂载
Vue.prototype.axiosPath = "/admin";

// Vue 实例
newVue(Validate, "#app");
