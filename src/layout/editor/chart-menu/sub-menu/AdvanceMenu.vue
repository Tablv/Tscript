<template>
  <div>
    <!-- 事件 -->
    <events />
    <!-- 轮播查询 -->
    <rotation-query />
    <!-- SQL 查询 -->
    <sql-query />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Events from "./functional/block/Events.vue";
import SqlQuery from "./functional/block/SqlQuery.vue";
import RotationQuery from "./functional/block/RotationQuery.vue";

@Component({
  components: {
    Events,
    SqlQuery,
    RotationQuery
  }
})
export default class AdvanceMenu extends Vue {}
</script>

<style lang="scss" scoped>
// 颜色定义
$fieldColor: #409eff;
</style>
