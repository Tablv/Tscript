<template>
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <template #header>
      <span>html编辑区</span>
    </template>
    <el-input
      type="textarea"
      :autosize="{ minRows: 13, maxRows: 14 }"
      placeholder="html代码片段"
      v-model="widget.config.htmlEditer"
    >
    </el-input>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Inject, Model } from "vue-property-decorator";
import { DashWidget, widgetConfig } from "@/types/DashWidget";
import { CommonStore } from "@/store/modules-model";
import { Properties } from "csstype";

@Component({})
export default class TextStyle extends Vue {
  // 当前仪表盘
  @CommonStore.Getter("currentDashboard")
  currentWidget!: DashWidget<any>;

  @Inject()
  boxCardBodyStyle!: Properties;

  get widget(): DashWidget<widgetConfig.THtml> {
    return this.currentWidget as DashWidget<widgetConfig.THtml>;
  }
}
</script>
