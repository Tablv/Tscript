import Vue from "vue";
import { newVue } from "@/dependencies/vue-instance";
import Editor from "./editor.vue";

// CSS
import "font-awesome/css/font-awesome.min.css";
import "animate.css";
import "@/assets/font/iconfont.css";

// Element-UI
import "@/dependencies/element-ui.js";

// Vue-Clipboard
import "@/dependencies/vue-clipboard";

// Svg Icons
import "@/assets/font/svg_icon.css";
import "@/assets/font/svg_icon.js";

// 原型挂载
Vue.prototype.axiosPath = "/admin";

// Vue 实例
newVue(Editor, "#app");
