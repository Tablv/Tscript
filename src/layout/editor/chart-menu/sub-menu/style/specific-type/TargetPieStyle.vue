<template>
  <div class="specific-style-items">
    <!-- 半径 -->
    <el-form-item label="半径">
      <el-row>
        <el-col :span="22">
          <el-slider v-model="specificStyle.radius[1]" :max="200" :min="1" />
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="环宽">
      <el-row>
        <el-col :span="22">
          <el-slider v-model="specificStyle.barWidth" :max="50" :min="1" />
        </el-col>
      </el-row>
    </el-form-item>
  </div>
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

  // 基础样式配置
  @Inject()
  getSpecificStyle!: Function;

  get specificStyle() {
    return this.getSpecificStyle();
  }
}
</script>
