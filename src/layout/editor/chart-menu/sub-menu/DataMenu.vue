<template>
  <div>
    <!-- 维度、度量 -->
    <axis v-cloak />

    <!-- 条件过滤 -->
    <where />

    <!-- 使用 JSON 数据 -->
    <json-static />
  </div>
</template>

<script lang="ts">
import { CreateElement } from "vue";
import { Component, Vue } from "vue-property-decorator";
import Axis from "./functional/Axis.vue";
import Where from "./functional/Where.vue";
import JsonStatic from "./functional/JsonStatic.vue";

@Component({
  components: {
    Axis,
    Where,
    JsonStatic
  }
})
export default class DataMenu extends Vue {}
</script>

<style lang="scss" scoped>
// 颜色定义
$fieldColor: #409eff;
[v-cloak] {
  display: none !important;
}
</style>
