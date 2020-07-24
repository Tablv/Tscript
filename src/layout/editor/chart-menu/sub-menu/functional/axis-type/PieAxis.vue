<template>
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <el-form label-position="top" label-width="60px">
      <el-form-item label="维度">
        <!-- 对比值拖拽区域 -->
        <axis-widget
          v-model="dimensions"
          axis-type="x"
          :disabled="isDimensionsAble"
          :function-enable="false"
        />
      </el-form-item>

      <!-- 实际值拖拽区域 -->
      <el-form-item label="度量">
        <axis-widget
          v-model="measuresY"
          axis-type="y"
          :function-enable="true"
          :emit-mode="true"
          :disabled="isMeasuresAble"
          @change="addMeasuresY"
        />
      </el-form-item>

      <el-form-item label="规则">
        <el-card body-style="padding: 0">
          <div class="rule-container">
            <div class="rule-text">维度： 1个</div>
            <div class="rule-text">度量： 1个</div>
          </div>
          <div class="rule-container">
            <div class="rule-text">维度： 0个</div>
            <div class="rule-text">度量： 无限个</div>
          </div>
        </el-card>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import AxisWidget from "../widget/AxisWidget.vue";
import "@/assets/draggable.scss";
import MenuOptions from "@/config/MenuOptions";
import { FieldType } from "glaway-bi-model/enums/FieldType";
import FieldDTO from "glaway-bi-model/params/FieldDTO";
import ObjectUtil from "@/util/ObjectUtil";
import { WarnSymbolType } from "glaway-bi-model/enums/WarnType";
import { thresholdComparators } from "glaway-bi-model/enums/ComparableSymbol";

@Component({
  components: {
    AxisWidget
  }
})
export default class Axis extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @Inject()
  boxCardBodyStyle!: Properties;

  @Inject()
  boxCardShadow!: string;

  @Inject()
  elFormLabelWidth!: string;

  created() {
    this.setDefaultFieldType();
  }

  get isDoubleMeasures(): boolean {
    const chartType = this.currentDashboard?.visualData.type;
    return MenuOptions.getChartFunctionalOptions(chartType)?.doubleMeasures;
  }

  get isDimensionsAble() {
    // 维度
    return (
      this.currentDashboard?.analysis.dimensions.length === 1 ||
      this.currentDashboard?.analysis.measures.length > 1
    );
  }

  get isMeasuresAble() {
    // 度量
    if (this.currentDashboard?.analysis.dimensions.length === 1) {
      return this.currentDashboard?.analysis.measures.length === 1;
    } else {
      return false;
    }
  }

  doComparer(
    value: number,
    symbol: WarnSymbolType,
    threshold: number
  ): boolean {
    const handle = thresholdComparators[symbol];
    if (!handle) {
      console.error(`找不到比较方法: ${symbol}`);
      return false;
    }
    const result = handle(value, threshold);

    return result;
  }

  /**
   * 为兼容旧版数据
   * 不存在字段类型时，赋值默认类型
   */
  setDefaultFieldType() {
    this.dimensions.forEach(d => {
      if (!d.type) d.type = FieldType.dimension;
    });

    this.allMeasures.forEach(m => {
      if (!m.type) m.type = FieldType.measureY;
    });
  }

  /**
   * 维度 数据
   */
  get dimensions(): Array<FieldDTO> {
    return this.currentDashboard.analysis.dimensions;
  }

  set dimensions(dimensions: Array<FieldDTO>) {
    this.currentDashboard.analysis.dimensions = dimensions;
  }

  /**
   * 获取度量
   */
  get allMeasures(): Array<FieldDTO> {
    return this.currentDashboard.analysis.measures;
  }

  set allMeasures(allMeasures: Array<FieldDTO>) {
    this.currentDashboard.analysis.measures = allMeasures;
  }

  /**
   * 度量Y 数据
   */
  get measuresY(): Array<FieldDTO> {
    return this.allMeasures.filter(
      measure => measure.type === FieldType.measureY
    );
  }

  set measuresY(measuresY: Array<FieldDTO>) {
    this.allMeasures = measuresY;
  }

  addMeasuresY(measuresY: Array<FieldDTO>) {
    this.measuresY = measuresY;
  }
}
</script>

<style lang="scss" scoped>
@import "./axis-type";
</style>
