<template>
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <el-form label-position="top" label-width="60px">
      <el-form-item label="维度">
        <!-- 维度拖拽区域 -->
        <axis-widget
          v-model="dimensions"
          axis-type="x"
          :disabled="isDimensionsAble"
          :function-enable="false"
        />
      </el-form-item>

      <!-- 度量拖拽区域 -->
      <el-form-item :label="isDoubleMeasures ? '柱度量' : '度量'">
        <axis-widget
          v-model="measuresY"
          axis-type="y"
          :function-enable="true"
          :emit-mode="true"
          @change="addMeasuresY"
        />
      </el-form-item>

      <el-form-item v-if="isDoubleMeasures" label="线度量">
        <axis-widget
          v-model="measuresZ"
          axis-type="z"
          :function-enable="true"
          :emit-mode="true"
          @change="addMeasuresZ"
        />
      </el-form-item>

      <el-form-item label="规则">
        <el-card body-style="padding: 0">
          <div class="rule-container">
            <div class="rule-text">维度： 0 ~ 2个</div>
            <div class="rule-text">度量： 至少1个</div>
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

  get isDoubleMeasures(): boolean {
    const chartType = this.currentDashboard?.visualData.type;
    return MenuOptions.getChartFunctionalOptions(chartType)?.doubleMeasures;
  }

  created() {
    this.setDefaultFieldType();
  }

  get isDimensionsAble() {
    // 维度 有 度量来确定
    // 度量 有 维度来确定
    // 例如  维度
    /**
     * 先去校验度量找出符合度量规则的 维度规则 进行校验
     * some 去操作
     * 如果给false， 给false
     * 接着去校验相应维度
     */
    // 维度
    return this.currentDashboard?.analysis.dimensions.length === 2;
    // const chartType = this.currentDashboard?.visualData.type;
    // const dimensionsNum =
    //   this.currentDashboard?.analysis.dimensions.length || 0;
    // // 度量
    // const measuresNum = this.currentDashboard?.analysis.measures.length || 0;

    // const changeLimit = ObjectUtil.copy(
    //   MenuOptions.getChartFunctionalOptions(chartType).changeLimit
    // );
    // let dimensions: any = [];
    // for (let index = changeLimit.length - 1; index >= 0; index--) {
    //   const measures = changeLimit[index].measures;
    //   const result = measures.every((config: any) => {
    //     return this.doComparer(measuresNum, config.symbol, config.value);
    //   });
    //   if (result) {
    //     dimensions = changeLimit[index].dimensions;
    //   }
    // }
    // return !dimensions.every((config: any) => {
    //   return this.doComparer(dimensionsNum, config.symbol, config.value);
    // });
  }

  // get isMeasuresAble() {
  //   // const chartType = this.currentDashboard?.visualData.type;
  //   // const dimensionsNum =
  //   //   this.currentDashboard?.analysis.dimensions.length || 0;
  //   // // 度量
  //   // const measuresNum = this.currentDashboard?.analysis.measures.length || 0;

  //   // const changeLimit = ObjectUtil.copy(
  //   //   MenuOptions.getChartFunctionalOptions(chartType).changeLimit
  //   // );
  //   // let measures: any = [];
  //   // for (let index = changeLimit.length - 1; index >= 0; index--) {
  //   //   const dimensions = changeLimit[index].dimensions;
  //   //   const result = dimensions.every((config: any) => {
  //   //     return this.doComparer(dimensionsNum, config.symbol, config.value);
  //   //   });
  //   //   if (result) {
  //   //     measures = changeLimit[index].measures;
  //   //   }
  //   // }
  //   // return measures.every((config: any) => {
  //   //   return this.doComparer(measuresNum, config.symbol, config.value);
  //   // });
  // }

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
    this.allMeasures = measuresY.concat(this.measuresZ);
  }

  addMeasuresY(measuresY: Array<FieldDTO>) {
    this.measuresY = measuresY;
  }

  /**
   * 度量Z 数据
   */
  get measuresZ(): Array<FieldDTO> {
    return this.allMeasures.filter(
      measure => measure.type === FieldType.measureZ
    );
  }

  set measuresZ(measuresZ: Array<FieldDTO>) {
    this.allMeasures = this.measuresY.concat(measuresZ);
  }

  addMeasuresZ(measuresZ: Array<FieldDTO>) {
    this.measuresZ = measuresZ;
  }
}
</script>

<style lang="scss" scoped>
@import "./axis-type";
</style>
