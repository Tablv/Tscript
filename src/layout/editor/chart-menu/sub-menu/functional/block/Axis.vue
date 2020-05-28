<template>
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <template #header>
      <span>维度和度量</span>
    </template>

    <el-form label-position="right" label-width="60px">
      <el-form-item label="维度">
        <!-- 维度拖拽区域 -->
        <axis-widget
          v-model="dimensions"
          axis-type="x"
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
import FieldDTO from "glaway-bi-model/params/FieldDTO";
import { FieldType } from "glaway-bi-model/enums/FieldType";

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

<style lang="scss" scoped></style>
