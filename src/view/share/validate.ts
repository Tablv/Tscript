import { newVue } from "@/dependencies/vue-instance";
import Validate from "./validate.vue";

// CSS
import "font-awesome/css/font-awesome.min.css";
import "animate.css";

// Element-UI
import "@/dependencies/element-ui.js";

import AxiosUtil from "@/util/AxiosUtil";

// 设置API上下文
AxiosUtil.setBasePath("/admin");

// Vue 实例
newVue(Validate, "#app");
