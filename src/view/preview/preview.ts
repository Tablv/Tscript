import { newVue } from "@/dependencies/vue-instance";
import Preview from "./preview.vue";

// CSS
import "@fortawesome/fontawesome-free/css/all.min.css";
import "animate.css";

// Element-UI
import "@/dependencies/element-ui.js";

import "@/dependencies/glaway-bi.ts";

import AxiosUtil from "@/util/AxiosUtil";

// 设置API上下文
AxiosUtil.setBasePath("/admin");

// Vue 实例
newVue(Preview, "#app");
