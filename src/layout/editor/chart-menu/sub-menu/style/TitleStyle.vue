<template>
  <!-- 标题 -->
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <template #header>
      <span>标题</span>
    </template>

    <el-form label-position="right" :label-width="elFormLabelWidth">
      <el-form-item label="显示标题">
        <el-switch
          v-model="currentDashboard.echarts.title.show"
          active-color="#13ce66"
        />
      </el-form-item>

      <detail-card :visible="currentDashboard.echarts.title.show">
        <el-form-item label="标题">
          <el-input clearable v-model="currentDashboard.echarts.title.text" />
        </el-form-item>

        <el-form-item label="字体">
          <el-select
            v-model="currentDashboard.echarts.title.textStyle.fontFamily"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in styleSelection.title.fontFamily.selection"
              :key="index"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="字体大小">
          <el-select
            v-model="currentDashboard.echarts.title.textStyle.fontSize"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in styleSelection.title.size.selection"
              :key="index"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="字体颜色">
          <el-row>
            <el-col :span="18">
              <el-select
                v-model="currentDashboard.echarts.title.textStyle.color"
              >
                <el-option
                  v-for="(item, index) in styleSelection.title.color.selection"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-col>

            <el-col :span="5" :offset="1" style="height: 32px;">
              <color-picker
                v-model="currentDashboard.echarts.title.textStyle.color"
              />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="对齐方式">
          <el-radio-group v-model="currentDashboard.echarts.title.left">
            <el-radio-button
              :key="idx"
              v-for="(sel, idx) in styleSelection.title.left.selection"
              :label="sel.value"
              >{{ sel.text }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item label="轴边距">
          <el-row>
            <el-col :span="11">
              <el-input-number
                placeholder="上"
                controls-position="right"
                v-model="currentDashboard.echarts.title.padding[0]"
              ></el-input-number>
            </el-col>
            <el-col
              :span="11"
              :offset="2"
              v-show="currentDashboard.echarts.title.left === 'auto'"
            >
              <el-input-number
                placeholder="右"
                controls-position="right"
                v-model="currentDashboard.echarts.title.padding[1]"
              ></el-input-number>
            </el-col>
            <el-col
              :span="11"
              :offset="2"
              v-show="currentDashboard.echarts.title.left === 'left'"
            >
              <el-input-number
                placeholder="左"
                controls-position="right"
                v-model="currentDashboard.echarts.title.padding[3]"
              ></el-input-number>
            </el-col>
          </el-row>
        </el-form-item>
      </detail-card>

      <el-form-item label="显示副标题" v-if="specificStyle.title">
        <el-switch v-model="specificStyle.title.show" active-color="#13ce66" />
      </el-form-item>

      <detail-card
        :visible="specificStyle.title.show"
        v-if="specificStyle.title"
      >
        <el-form-item label="字体">
          <el-select
            v-model="specificStyle.title.fontFamily"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in styleSelection.title.fontFamily.selection"
              :key="index"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="字体大小">
          <el-select
            v-model="specificStyle.title.fontSize"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in styleSelection.title.size.selection"
              :key="index"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="字体颜色">
          <el-row>
            <el-col :span="18">
              <el-select v-model="specificStyle.title.color">
                <el-option
                  v-for="(item, index) in styleSelection.title.color.selection"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-col>

            <el-col :span="5" :offset="1" style="height: 32px;">
              <color-picker v-model="specificStyle.title.color" />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="背景色">
          <el-row>
            <el-col :span="18">
              <el-select v-model="specificStyle.title.backgroundColor">
                <el-option
                  v-for="(item, index) in styleSelection.title.color.selection"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-col>

            <el-col :span="5" :offset="1" style="height: 32px;">
              <color-picker v-model="specificStyle.title.backgroundColor" />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="水平偏移量">
          <el-slider
            v-model="specificStyle.title.offsetCenter[0]"
            :max="100"
            :min="-100"
          />
        </el-form-item>
        <el-form-item label="垂直偏移量">
          <el-slider
            v-model="specificStyle.title.offsetCenter[1]"
            :max="100"
            :min="-100"
          />
        </el-form-item>
      </detail-card>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import ValueUnitOption from "./common/ValueUnitOption.vue";
import DetailCard from "@/components/DetailCard.vue";
import ColorPicker from "@/components/color-picker/index.vue";
import { ChartOption } from "glaway-bi-model/view/dashboard/chart/ChartOption";

@Component({
  components: {
    ValueUnitOption,
    DetailCard,
    ColorPicker
  }
})
export default class TitleStyle extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @EditorStore.State("styleSelection")
  styleSelection!: Object;

  @Inject()
  boxCardBodyStyle!: Properties;

  @Inject()
  boxCardShadow!: string;

  @Inject()
  elFormLabelWidth!: string;

  @Inject()
  getSpecificStyle!: Function;

  get specificStyle(): ChartOption {
    return this.getSpecificStyle();
  }
}
</script>

<style lang="scss" scoped>
.el-input-number--small {
  width: 90px;
  margin-bottom: 8px;
}
</style>
