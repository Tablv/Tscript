<template>
  <!-- 提示标签 -->
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
    v-if="currentDashboard.echarts.tooltip"
  >
    <template #header>
      <span>提示标签</span>
    </template>
    <el-form label-position="right" :label-width="elFormLabelWidth">
      <!-- 坐标系开关 -->
      <el-form-item label="显示提示标签">
        <el-row>
          <el-col :span="24">
            <el-switch v-model="tooltip.show" active-color="#13ce66" />
          </el-col>
        </el-row>
      </el-form-item>
      <detail-card :visible="tooltip.show">
        <el-form-item label="背景颜色">
          <el-row>
            <el-col :span="18">
              <el-select v-model="tooltip.backgroundColor">
                <el-option
                  v-for="(item, index) in styleSelection.title.color.selection"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-col>

            <el-col :span="5" :offset="1" style="height: 32px;">
              <color-picker v-model="tooltip.backgroundColor" />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="字体类型">
          <el-select
            v-model="tooltip.textStyle.fontFamily"
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
          <el-select v-model="tooltip.textStyle.fontSize" placeholder="请选择">
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
              <el-select v-model="tooltip.textStyle.color">
                <el-option
                  v-for="(item, index) in styleSelection.title.color.selection"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-col>

            <el-col :span="5" :offset="1" style="height: 32px;">
              <color-picker v-model="tooltip.textStyle.color" />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="边框颜色">
          <el-row>
            <el-col :span="18">
              <el-select v-model="tooltip.borderColor">
                <el-option
                  v-for="(item, index) in styleSelection.title.color.selection"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-col>

            <el-col :span="5" :offset="1" style="height: 32px;">
              <color-picker v-model="tooltip.borderColor" />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="边框宽度">
          <el-slider v-model="tooltip.borderWidth" :min="0" />
        </el-form-item>
      </detail-card>

      <!-- BORDER -->
      <!-- <el-form-item label="边框">
        <switch-button v-model="showSwitch.border"></switch-button>
      </el-form-item>
      <detail-card :visible="showSwitch.border">
        <el-form-item label="边框颜色">
          <el-row>
            <el-col :span="18">
              <el-select v-model="tooltip.borderColor">
                <el-option
                  v-for="(item, index) in styleSelection.title.color.selection"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-col>

            <el-col :span="5" :offset="1" style="height: 32px;">
              <color-picker v-model="tooltip.borderColor" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="边框宽度">
          <el-slider v-model="tooltip.borderWidth" :min="0" />
        </el-form-item>
      </detail-card> -->

      <!-- fONTSTYLE -->
      <!-- <el-form-item label="文字字体">
        <switch-button v-model="showSwitch.font"></switch-button>
      </el-form-item>
      <detail-card :visible="showSwitch.font">
        <el-form-item label="字体类型">
          <el-select
            v-model="tooltip.textStyle.fontFamily"
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
          <el-select v-model="tooltip.textStyle.fontSize" placeholder="请选择">
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
              <el-select v-model="tooltip.textStyle.color">
                <el-option
                  v-for="(item, index) in styleSelection.title.color.selection"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-col>

            <el-col :span="5" :offset="1" style="height: 32px;">
              <color-picker v-model="tooltip.textStyle.color" />
            </el-col>
          </el-row>
        </el-form-item>
      </detail-card> -->

      <!-- fonttextborder -->
      <!-- <el-form-item label="文字描边">
        <switch-button v-model="showSwitch.textborder"></switch-button>
      </el-form-item>
      <detail-card :visible="showSwitch.textborder">
        <el-form-item label="描边颜色">
          <el-row>
            <el-col :span="18">
              <el-select v-model="tooltip.textStyle.textBorderColor">
                <el-option
                  v-for="(item, index) in styleSelection.title.color.selection"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-col>

            <el-col :span="5" :offset="1" style="height: 32px;">
              <color-picker v-model="tooltip.textStyle.textBorderColor" />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="描边宽度">
          <el-slider v-model="tooltip.textStyle.textBorderWidth" :min="0" />
        </el-form-item>
      </detail-card> -->

      <!-- fontShadow -->
      <!-- <el-form-item label="文字阴影">
        <switch-button v-model="showSwitch.textshadow"></switch-button>
      </el-form-item>
      <detail-card :visible="showSwitch.textshadow">
        <el-form-item label="阴影颜色">
          <color-picker v-model="tooltip.textStyle.textShadowColor" />
        </el-form-item>
        <el-form-item label="阴影宽度">
          <el-slider v-model="tooltip.textStyle.textShadowBlur" :min="0" />
        </el-form-item>
      </detail-card> -->
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import { BarSeriesOption } from "glaway-bi-model/view/dashboard/chart/BarSeriesOption";
import ValueUnitOption from "./common/ValueUnitOption.vue";
import DetailCard from "@/components/DetailCard.vue";
import ColorPicker from "@/components/color-picker/index.vue";
import SwitchButton from "@/components/SwitchButton.vue";

@Component({
  components: {
    DetailCard,
    ValueUnitOption,
    ColorPicker,
    SwitchButton
  }
})
export default class TooltipStyle extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @EditorStore.State("styleSelection")
  styleSelection!: any;

  @Inject()
  boxCardBodyStyle!: Properties;

  @Inject()
  elFormLabelWidth!: string;

  @Inject()
  getSpecificStyle!: Function;

  get specificStyle(): BarSeriesOption {
    return this.getSpecificStyle();
  }

  get tooltip() {
    return this.currentDashboard.echarts.tooltip;
  }
  showSwitch = {
    border: false,
    textfont: false,
    textborder: false,
    textshadow: false
  };
}
</script>
