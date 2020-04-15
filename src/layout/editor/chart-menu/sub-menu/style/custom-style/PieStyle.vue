<template>
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <div slot="header">
      <span>饼图样式</span>
    </div>

    <el-form label-position="right" :label-width="elFormLabelWidth">
      <!-- 配色部分 -->
      <color-option />
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "@/model/view/dashboard/Dashboard";
import ColorOption from "../common/ColorOption.vue";

@Component({
  components: {
    ColorOption
  }
})
export default class PieStyle extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @Inject()
  boxCardBodyStyle!: Properties;

  @Inject()
  boxCardShadow!: string;

  @Inject()
  elFormLabelWidth!: string;
}
</script>
