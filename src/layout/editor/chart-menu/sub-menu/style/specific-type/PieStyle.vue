<template>
  <div class="specific-style-items">
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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";

@Component({
  components: {}
})
export default class PieStyle extends Vue {
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
