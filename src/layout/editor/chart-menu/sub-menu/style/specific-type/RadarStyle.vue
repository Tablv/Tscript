<template>
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <template #header>
      <span>图表样式</span>
    </template>

    <el-form label-position="right" :label-width="elFormLabelWidth">
      <!-- 配色部分 -->
      <color-option />

      <el-form-item label="背景色">
        <el-row>
          <el-col :span="5" :offset="1" style="height: 32px;">
            <el-color-picker
              v-model="currentDashboard.visualData.background"
              :show-alpha="true"
              color-format="hex"
              size="mini"
            />
          </el-col>
        </el-row>
      </el-form-item>

      <!-- 半径 -->
      <el-form-item label="半径(外)">
        <el-row>
          <el-col :span="22">
            <el-slider
              v-model="specificStyle.radiusConfig.outside"
              :max="200"
              :min="1"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="半径(内)">
        <el-row>
          <el-col :span="22">
            <el-slider
              v-model="specificStyle.radiusConfig.inside"
              :max="200"
              :min="0"
            />
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import ColorOption from "../common/ColorOption.vue";
import { ChartOption } from "glaway-bi-model/view/dashboard/chart/ChartOption";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";

@Component({
  components: {
    ColorOption
  }
})
export default class RadarStyle extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @EditorStore.State("styleSelection")
  styleSelection!: any;

  @Inject()
  boxCardBodyStyle!: Properties;

  @Inject()
  boxCardShadow!: string;

  @Inject()
  elFormLabelWidth!: string;

  // 基础样式配置
  @Inject()
  getSpecificStyle!: Function;

  get specificStyle() {
    return this.getSpecificStyle();
  }
}
</script>

<style lang="scss" scoped>
.position-lable {
  position: absolute;
  z-index: 10;
  left: -34px;
  font-size: 13px;
  color: #606266;
}
</style>
