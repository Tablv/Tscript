<template>
  <div>
    <!-- 事件 -->
    <events />

    <!-- SQL 查询 -->
    <sql-query />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Events from "./functional/block/Events.vue";
import SqlQuery from "./functional/block/SqlQuery.vue";

@Component({
  components: {
    Events,
    SqlQuery
  }
})
export default class AdvanceMenu extends Vue {}
</script>

<style lang="scss" scoped>
// 颜色定义
$fieldColor: #409eff;
</style>
