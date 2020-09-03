<template>
  <div class="specific-style-items">
    <!-- 地图切换 -->
    <el-form-item label="地图切换">
      <el-row>
        <el-col :span="24">
          <el-cascader
            v-model="specificStyle.mapList"
            :options="options"
            :props="{ checkStrictly: true }"
            :show-all-levels="false"
            filterable
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
    </el-form-item>

    <!-- 加载坐标系 -->
    <!-- geoIndex -->
    <el-form-item label="挂载坐标系">
      <el-row>
        <el-col :span="24">
          <el-switch
            v-model="specificStyle.geoIndex"
            active-color="#13ce66"
            :active-value="0"
            :inactive-value="1"
          />
        </el-col>
      </el-row>
    </el-form-item>
    <!-- 长宽比 -->
    <!-- <el-form-item label="长宽比">
      <el-row>
        <el-col :span="24">
          <el-slider
            v-model="currentDashboard.echarts.geo.aspectScale"
            :format-tooltip="formatTooltip"
            :min="1"
          />
        </el-col>
      </el-row>
    </el-form-item> -->
    <!-- 放大 -->
    <!-- <el-form-item label="放大倍数">
      <el-row>
        <el-col :span="24">
          <el-slider
            v-model="currentDashboard.echarts.geo.zoom"
            step="0.1"
            :min="1"
            :max="10"
          />
        </el-col>
      </el-row>
    </el-form-item> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import { BarSeriesOption } from "glaway-bi-model/view/dashboard/chart/SeriesOption";

@Component({
  components: {}
})
export default class BarStyle extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @EditorStore.State("styleSelection")
  styleSelection!: any;

  @Inject()
  getSpecificStyle!: Function;

  get specificStyle(): BarSeriesOption {
    return this.getSpecificStyle();
  }
  formatTooltip(val: number) {
    return val / 100;
  }

  options = [
    {
      value: "china",
      label: "全国"
    },
    {
      value: "370000",
      label: "山东",
      children: [
        {
          value: "371700",
          label: "菏泽"
        }
      ]
    },
    {
      value: "320000",
      label: "江苏",
      children: [
        {
          value: "320100",
          label: "南京"
        }
      ]
    }
  ];
}
</script>
