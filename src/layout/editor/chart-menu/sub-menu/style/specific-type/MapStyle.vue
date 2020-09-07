<template>
  <div class="specific-style-items">
    <!-- 加载坐标系 -->
    <!-- geoIndex -->
    <el-form-item label="挂载坐标系">
      <el-row>
        <el-col :span="24">
          <el-switch
            v-model="specificStyle.geoIndex"
            active-color="#13ce66"
            @change="handelGeoIndex"
            :active-value="0"
            :inactive-value="1"
          />
        </el-col>
      </el-row>
    </el-form-item>

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

    <el-form-item label="地图样式">
      <switch-button v-model="showSwitch.itemStyle"></switch-button>
    </el-form-item>
    <detail-card :visible="showSwitch.itemStyle">
      <el-form-item label="地图颜色">
        <el-row>
          <el-col :span="18">
            <el-select v-model="specificStyle.itemStyle.areaColor">
              <el-option
                v-for="(item, index) in styleSelection.title.color.selection"
                :key="index"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-col>

          <el-col :span="5" :offset="1" style="height: 32px;">
            <color-picker v-model="specificStyle.itemStyle.areaColor" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="描边颜色">
        <el-row>
          <el-col :span="18">
            <el-select v-model="specificStyle.itemStyle.borderColor">
              <el-option
                v-for="(item, index) in styleSelection.title.color.selection"
                :key="index"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-col>

          <el-col :span="5" :offset="1" style="height: 32px;">
            <color-picker v-model="specificStyle.itemStyle.borderColor" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="描边宽度">
        <el-slider
          step="0.1"
          v-model="specificStyle.itemStyle.borderWidth"
          :min="0"
          :max="10"
        />
      </el-form-item>
      <el-form-item label="描边类型">
        <el-select v-model="specificStyle.itemStyle.borderType">
          <el-option key="solid" label="实线" value="solid" />
          <el-option key="dashed" label="虚线" value="dashed" />
          <el-option key="dotted" label="点状" value="dotted" />
        </el-select>
      </el-form-item>

      <el-form-item label="阴影颜色">
        <el-row>
          <el-col :span="18">
            <el-select v-model="specificStyle.itemStyle.shadowColor">
              <el-option
                v-for="(item, index) in styleSelection.title.color.selection"
                :key="index"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-col>

          <el-col :span="5" :offset="1" style="height: 32px;">
            <color-picker v-model="specificStyle.itemStyle.shadowColor" />
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="模糊大小">
        <el-slider
          step="0.1"
          v-model="specificStyle.itemStyle.shadowBlur"
          :min="0"
          :max="10"
        />
      </el-form-item>

      <el-form-item label="水平偏移">
        <el-slider
          step="0.1"
          v-model="specificStyle.itemStyle.shadowOffsetX"
          :min="0"
        />
      </el-form-item>

      <el-form-item label="垂直偏移">
        <el-slider
          step="0.1"
          v-model="specificStyle.itemStyle.shadowOffsetY"
          :min="0"
        />
      </el-form-item>
    </detail-card>

    <el-form-item label="高亮状态样式">
      <switch-button v-model="showSwitch.emphasis"></switch-button>
    </el-form-item>
    <detail-card :visible="showSwitch.emphasis">
      <el-form-item label="地图颜色">
        <el-row>
          <el-col :span="18">
            <el-select v-model="specificStyle.emphasis.itemStyle.areaColor">
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
              v-model="specificStyle.emphasis.itemStyle.areaColor"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="描边颜色">
        <el-row>
          <el-col :span="18">
            <el-select v-model="specificStyle.emphasis.itemStyle.borderColor">
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
              v-model="specificStyle.emphasis.itemStyle.borderColor"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="描边宽度">
        <el-slider
          step="0.1"
          v-model="specificStyle.emphasis.itemStyle.borderWidth"
          :min="0"
          :max="10"
        />
      </el-form-item>
      <el-form-item label="描边类型">
        <el-select v-model="specificStyle.emphasis.itemStyle.borderType">
          <el-option key="solid" label="实线" value="solid" />
          <el-option key="dashed" label="虚线" value="dashed" />
          <el-option key="dotted" label="点状" value="dotted" />
        </el-select>
      </el-form-item>

      <el-form-item label="阴影颜色">
        <el-row>
          <el-col :span="18">
            <el-select v-model="specificStyle.emphasis.itemStyle.shadowColor">
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
              v-model="specificStyle.emphasis.itemStyle.shadowColor"
            />
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="模糊大小">
        <el-slider
          step="0.1"
          v-model="specificStyle.emphasis.itemStyle.shadowBlur"
          :min="0"
          :max="10"
        />
      </el-form-item>

      <el-form-item label="水平偏移">
        <el-slider
          step="0.1"
          v-model="specificStyle.emphasis.itemStyle.shadowOffsetX"
          :min="0"
        />
      </el-form-item>

      <el-form-item label="垂直偏移">
        <el-slider
          step="0.1"
          v-model="specificStyle.emphasis.itemStyle.shadowOffsetY"
          :min="0"
        />
      </el-form-item>
    </detail-card>
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
import { BarSeriesOption } from "glaway-bi-model/view/dashboard/chart/BarSeriesOption";
import ColorPicker from "@/components/color-picker/index.vue";
import DetailCard from "@/components/DetailCard.vue";
import SwitchButton from "@/components/SwitchButton.vue";

@Component({
  components: {
    ColorPicker,
    DetailCard,
    SwitchButton
  }
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

  handelGeoIndex(value: number) {
    // if (this.currentDashboard.echarts.geo && !value) {
    //   this.currentDashboard.echarts.geo.show = true;
    // }
  }
  showSwitch = {
    itemStyle: false,
    emphasis: false
  };
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
