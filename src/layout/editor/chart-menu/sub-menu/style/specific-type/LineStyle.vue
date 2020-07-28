<template>
  <div class="specific-style-items">
    <el-form-item label="线型">
      <el-select v-model="lineType" @change="doHandleLineChange">
        <el-option :value="0" label="折线"></el-option>
        <el-option :value="1" label="平滑曲线"></el-option>
      </el-select>
    </el-form-item>

    <!-- 线图空值略过方式 -->
    <el-form-item label="空值略过方式">
      <el-select v-model="connectNulls" @change="doHandleConnectChange">
        <el-option :value="0" label="断点"></el-option>
        <el-option :value="1" label="跨过"></el-option>
        <el-option :value="2" label="0"></el-option>
      </el-select>
    </el-form-item>

    <!-- 标记形状 -->
    <el-form-item label="标记形状">
      <el-select v-model="specificStyle.symbol">
        <el-option
          v-for="item in symbolList"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="标记大小">
      <el-slider v-model="specificStyle.symbolSize" :min="0" />
    </el-form-item>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import DetailCard from "@/components/DetailCard.vue";

@Component({
  components: {
    DetailCard
  }
})
export default class BarStyle extends Vue {
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

  lineType = 0;

  connectNulls = 0;

  symbolList = [
    { key: "none", label: "无" },
    { key: "emptyCircle", label: "空心点" },
    { key: "circle", label: "实心点" },
    { key: "rect", label: "正方形" },
    { key: "roundRect", label: "圆角正方形" },
    { key: "triangle", label: "三角形" },
    { key: "diamond", label: "菱形" },
    { key: "pin", label: "气球" },
    { key: "arrow", label: "箭头" }
  ];

  // 处理线形选择的选择
  doHandleLineChange(type: number) {
    this.specificStyle.smooth = Boolean(type);
  }

  // 处理连接方式的选择
  doHandleConnectChange(type: number) {
    if (type === 2) {
      // 不作处理
      this.specificStyle.connectNulls = null;
    } else {
      this.specificStyle.connectNulls = Boolean(type);
    }
  }
}
</script>
