<template>
  <el-form label-position="right" :label-width="elFormLabelWidth">
    <!-- 半径 -->
    <el-form-item label="半径">
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
    <el-form-item label="环宽">
      <el-row>
        <el-col :span="22">
          <el-slider
            v-model="specificStyle.radiusConfig.axisLineWidth"
            :max="50"
            :min="1"
          />
        </el-col>
      </el-row>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";

@Component({
  components: {}
})
export default class TargetPieStyle extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

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
