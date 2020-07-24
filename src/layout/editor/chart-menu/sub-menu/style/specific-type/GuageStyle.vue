<template>
  <div class="specific-style-items">
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
    <el-form-item label="坐标轴">
      <el-switch v-model="showSwitch.axisLine" active-color="#13ce66" />
    </el-form-item>

    <detail-card :visible="showSwitch.axisLine">
      <el-form-item label="坐标轴线">
        <el-row>
          <el-col :span="22">
            <el-slider
              v-model="specificStyle.radiusConfig.axisLineWidth"
              :max="100"
              :min="0"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="分隔线">
        <el-row>
          <el-col :span="22">
            <el-slider
              v-model="specificStyle.splitLine.length"
              :max="100"
              :min="0"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="小标记">
        <el-row>
          <el-col :span="22">
            <el-slider
              v-model="specificStyle.axisTick.length"
              :max="100"
              :min="0"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="分割段数">
        <el-select v-model="specificStyle.splitNumber">
          <el-option
            v-for="(sel, idx) in styleSelection.legend.fontSize.selection"
            :key="idx"
            :label="sel.value"
            :value="sel.value"
          />
        </el-select>
      </el-form-item>
    </detail-card>

    <el-form-item label="指针">
      <el-switch v-model="showSwitch.pointer" active-color="#13ce66" />
    </el-form-item>

    <detail-card :visible="showSwitch.pointer">
      <el-form-item label="指针宽度">
        <el-row>
          <el-col :span="22">
            <el-slider
              v-model="specificStyle.pointer.width"
              :max="100"
              :min="0"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="指针长度">
        <el-row>
          <el-col :span="22">
            <el-slider
              v-model="specificStyle.pointer.length"
              :max="100"
              :min="0"
            />
          </el-col>
        </el-row>
      </el-form-item>
    </detail-card>

    <el-form-item label="角度">
      <el-switch v-model="showSwitch.angle" active-color="#13ce66" />
    </el-form-item>

    <detail-card :visible="showSwitch.angle">
      <el-form-item label="起始角度">
        <el-row>
          <el-col :span="22">
            <el-slider
              v-model="specificStyle.startAngle"
              :max="360"
              :min="-360"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="结束角度">
        <el-row>
          <el-col :span="22">
            <el-slider
              v-model="specificStyle.endAngle"
              :max="360"
              :min="-360"
            />
          </el-col>
        </el-row>
      </el-form-item>
    </detail-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import { ChartOption } from "glaway-bi-model/view/dashboard/chart/ChartOption";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import DetailCard from "@/components/DetailCard.vue";

@Component({
  components: {
    DetailCard
  }
})
export default class GuageStyle extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @EditorStore.State("styleSelection")
  styleSelection!: any;

  // 基础样式配置
  @Inject()
  getSpecificStyle!: Function;

  get specificStyle() {
    return this.getSpecificStyle();
  }

  showSwitch = {
    axisLine: false,
    pointer: false,
    angle: false
  };
}
</script>
