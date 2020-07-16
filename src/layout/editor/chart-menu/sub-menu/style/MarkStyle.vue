<template>
  <!-- 标注 -->
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <template #header>
      <span>数据标注 </span>
    </template>

    <el-form label-position="right" :label-width="elFormLabelWidth">
      <el-form-item label="显示提示标签">
        <el-switch
          active-color="#13ce66"
          v-model="currentDashboard.echarts.tooltip.show"
        />
      </el-form-item>

      <el-form-item label="显示数据标注">
        <el-switch active-color="#13ce66" v-model="specificStyle.label.show" />
      </el-form-item>

      <el-collapse-transition>
        <div v-show="specificStyle.label.show">
          <el-form-item label="字体">
            <el-select
              v-model="specificStyle.label.fontFamily"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in styleSelection.label.fontFamily
                  .selection"
                :key="index"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="字体大小">
            <el-select
              v-model="specificStyle.label.fontSize"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in styleSelection.label.size.selection"
                :key="index"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="字体颜色">
            <el-row>
              <el-col :span="18">
                <el-select v-model="specificStyle.label.color">
                  <el-option
                    v-for="(item, index) in styleSelection.label.color
                      .selection"
                    :key="index"
                    :label="item.text"
                    :value="item.value"
                  />
                </el-select>
              </el-col>

              <el-col :span="5" :offset="1" style="height: 32px;">
                <el-color-picker v-model="specificStyle.label.color" />
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="显示数值" v-if="this.specificStyle.centerConfig">
            <el-switch
              active-color="#13ce66"
              v-model="specificStyle.label.isShowNumer"
            />
          </el-form-item>

          <el-form-item label="位置" v-show="!specificStyle.label.hidePosition">
            <el-select
              v-model="specificStyle.label.position"
              size="mini"
              placeholder="位置"
            >
              <el-option
                v-for="(unit, index) in styleSelection.label.position.selection"
                :key="index"
                :label="unit.text"
                :value="unit.value"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-collapse-transition>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import { ChartOption } from "glaway-bi-model/view/dashboard/chart/ChartOption";
import { EChartsSampleStyle } from "glaway-bi-model/view/dashboard/EChartsOption";

@Component
export default class MarkStyle extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @EditorStore.State("styleSelection")
  styleSelection!: Object;

  @Inject()
  getSpecificStyle!: Function;

  get specificStyle(): ChartOption {
    return this.getSpecificStyle();
  }

  @Inject()
  boxCardBodyStyle!: Properties;

  @Inject()
  elFormLabelWidth!: string;

  @Inject()
  boxCardShadow!: string;
}
</script>

<style lang="scss" scoped></style>
