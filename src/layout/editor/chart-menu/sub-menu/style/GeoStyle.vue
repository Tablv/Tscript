<template>
  <!-- 地图坐标系 -->
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
    v-if="currentDashboard.echarts.geo"
  >
    <template #header>
      <span>地图坐标系</span>
    </template>
    <el-form label-position="right" :label-width="elFormLabelWidth">
      <!-- 坐标系开关 -->
      <el-form-item label="显示坐标系">
        <el-row>
          <el-col :span="24">
            <el-switch
              v-model="currentDashboard.echarts.geo.show"
              active-color="#13ce66"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <detail-card :visible="currentDashboard.echarts.geo.show">
        <!-- 地图切换 -->
        <el-form-item label="地图切换">
          <el-row>
            <el-col :span="24">
              <el-cascader
                v-model="currentDashboard.echarts.geo.mapList"
                :options="options"
                :props="{ checkStrictly: true }"
                :show-all-levels="false"
                filterable
                clearable
              ></el-cascader>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 长宽比 -->
        <el-form-item label="长宽比">
          <el-row>
            <el-col :span="24">
              <el-slider
                v-model="currentDashboard.echarts.geo.aspectScale"
                :format-tooltip="formatTooltip"
                :min="1"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 放大 -->
        <el-form-item label="放大倍数">
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
        </el-form-item>
        <value-unit-option
          form-label="顶部"
          v-model="currentDashboard.echarts.geo.layoutCenter[1]"
          :selection="styleSelection.grid.unit.selection"
        />
        <value-unit-option
          form-label="左侧"
          v-model="currentDashboard.echarts.geo.layoutCenter[0]"
          :selection="styleSelection.grid.unit.selection"
        />
      </detail-card>

      <el-form-item label="散点">
        <switch-button v-model="showSwitch.scatter"></switch-button>
      </el-form-item>
      <detail-card :visible="showSwitch.scatter">
        <el-form-item label="散点形状">
          <el-select v-model="currentDashboard.echarts.effectScatter.symbol">
            <el-option
              v-for="item in symbolList"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="散点大小">
          <el-slider
            step="0.1"
            v-model="currentDashboard.echarts.effectScatter.symbolSize"
            :min="0"
          />
        </el-form-item>

        <el-form-item label="旋转角度">
          <el-slider
            step="0.1"
            v-model="currentDashboard.echarts.effectScatter.symbolRotate"
            :min="0"
          />
        </el-form-item>

        <el-form-item label="散点颜色">
          <el-row>
            <el-col :span="18">
              <el-select
                v-model="currentDashboard.echarts.effectScatter.itemStyle.color"
              >
                <el-option
                  v-for="(item, index) in styleSelection.label.color.selection"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-col>

            <el-col :span="5" :offset="1" style="height: 32px;">
              <color-picker
                v-model="currentDashboard.echarts.effectScatter.itemStyle.color"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="描边颜色">
          <el-row>
            <el-col :span="18">
              <el-select
                v-model="currentDashboard.echarts.effectScatter.itemStyle.borderColor"
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
                v-model="currentDashboard.echarts.effectScatter.itemStyle.borderColor"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="描边宽度">
          <el-slider
            step="0.1"
            v-model="currentDashboard.echarts.effectScatter.itemStyle.borderWidth"
            :min="0"
            :max="10"
          />
        </el-form-item>
        <el-form-item label="描边类型">
          <el-select
            v-model="currentDashboard.echarts.effectScatter.itemStyle.borderType"
          >
            <el-option key="solid" label="实线" value="solid" />
            <el-option key="dashed" label="虚线" value="dashed" />
            <el-option key="dotted" label="点状" value="dotted" />
          </el-select>
        </el-form-item>

        <el-form-item label="阴影颜色">
          <el-row>
            <el-col :span="18">
              <el-select
                v-model="currentDashboard.echarts.effectScatter.itemStyle.shadowColor"
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
                v-model="currentDashboard.echarts.effectScatter.itemStyle.shadowColor"
              />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="模糊大小">
          <el-slider
            step="0.1"
            v-model="currentDashboard.echarts.effectScatter.itemStyle.shadowBlur"
            :min="0"
            :max="10"
          />
        </el-form-item>

        <el-form-item label="水平偏移">
          <el-slider
            step="0.1"
            v-model="currentDashboard.echarts.effectScatter.itemStyle.shadowOffsetX"
            :min="-100"
          />
        </el-form-item>

        <el-form-item label="垂直偏移">
          <el-slider
            step="0.1"
            v-model="currentDashboard.echarts.effectScatter.itemStyle.shadowOffsetY"
            :min="-100"
          />
        </el-form-item>
      </detail-card>

      <el-form-item label="散点特效">
        <switch-button v-model="showSwitch.scatterEffect"></switch-button>
      </el-form-item>
      <detail-card :visible="showSwitch.scatterEffect">
        <el-form-item label="开启特效">
          <el-row>
            <el-col :span="24">
              <el-switch
                v-model="currentDashboard.echarts.effectScatter.show"
                active-color="#13ce66"
              />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="涟漪大小">
          <el-slider
            step="0.1"
            v-model="currentDashboard.echarts.effectScatter.rippleEffect.scale"
            :min="0"
            :max="10"
          />
        </el-form-item>

        <el-form-item label="涟漪颜色">
          <el-row>
            <el-col :span="18">
              <el-select
                v-model="currentDashboard.echarts.effectScatter.rippleEffect.color"
              >
                <el-option
                  v-for="(item, index) in styleSelection.label.color.selection"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-col>

            <el-col :span="5" :offset="1" style="height: 32px;">
              <color-picker
                v-model="currentDashboard.echarts.effectScatter.rippleEffect.color"
              />
            </el-col>
          </el-row>
        </el-form-item>
      </detail-card>

      <el-form-item label="路径">
        <switch-button v-model="showSwitch.lines"></switch-button>
      </el-form-item>
      <detail-card :visible="showSwitch.lines">
        <el-form-item label="路径形状">
          <el-select v-model="currentDashboard.echarts.lines.lineStyle.type">
            <el-option key="solid" label="实线" value="solid" />
            <el-option key="dashed" label="虚线" value="dashed" />
            <el-option key="dotted" label="点状" value="dotted" />
          </el-select>
        </el-form-item>

        <el-form-item label="路径宽度">
          <el-slider
            step="0.1"
            v-model="currentDashboard.echarts.lines.lineStyle.width"
            :min="0"
          />
        </el-form-item>

        <el-form-item label="路径曲度">
          <el-slider
            step="0.1"
            v-model="currentDashboard.echarts.lines.lineStyle.curveness"
            :min="0"
            :max="1"
          />
        </el-form-item>

        <el-form-item label="路径颜色">
          <el-row>
            <el-col :span="18">
              <el-select
                v-model="currentDashboard.echarts.lines.lineStyle.color"
              >
                <el-option
                  v-for="(item, index) in styleSelection.label.color.selection"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-col>

            <el-col :span="5" :offset="1" style="height: 32px;">
              <color-picker
                v-model="currentDashboard.echarts.lines.lineStyle.color"
              />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="端点形状">
          <el-select v-model="currentDashboard.echarts.lines.symbol">
            <el-option
              v-for="item in symbolList"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="端点大小">
          <el-slider
            step="0.1"
            v-model="currentDashboard.echarts.lines.symbolSize"
            :min="0"
          />
        </el-form-item>

        <el-form-item label="阴影颜色">
          <el-row>
            <el-col :span="18">
              <el-select
                v-model="currentDashboard.echarts.lines.lineStyle.shadowColor"
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
                v-model="currentDashboard.echarts.lines.lineStyle.shadowColor"
              />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="模糊大小">
          <el-slider
            step="0.1"
            v-model="currentDashboard.echarts.lines.lineStyle.shadowBlur"
            :min="0"
            :max="10"
          />
        </el-form-item>

        <el-form-item label="水平偏移">
          <el-slider
            step="0.1"
            v-model="currentDashboard.echarts.lines.lineStyle.shadowOffsetX"
            :min="-100"
          />
        </el-form-item>

        <el-form-item label="垂直偏移">
          <el-slider
            step="0.1"
            v-model="currentDashboard.echarts.lines.lineStyle.shadowOffsetY"
            :min="-100"
          />
        </el-form-item>
      </detail-card>

      <el-form-item label="路径特效">
        <switch-button v-model="showSwitch.linesEffect"></switch-button>
      </el-form-item>
      <detail-card :visible="showSwitch.linesEffect">
        <el-form-item label="展示特效">
          <el-row>
            <el-col :span="24">
              <el-switch
                v-model="currentDashboard.echarts.lines.effect.show"
                active-color="#13ce66"
              />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="循环展示">
          <el-row>
            <el-col :span="24">
              <el-switch
                v-model="currentDashboard.echarts.lines.effect.loop"
                active-color="#13ce66"
              />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="标记形状">
          <el-select v-model="currentDashboard.echarts.lines.effect.symbol">
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
          <el-slider
            step="0.1"
            v-model="currentDashboard.echarts.lines.effect.symbolSize"
            :min="0"
          />
        </el-form-item>

        <el-form-item label="标记颜色">
          <el-row>
            <el-col :span="18">
              <el-select v-model="currentDashboard.echarts.lines.effect.color">
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
                v-model="currentDashboard.echarts.lines.effect.color"
              />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="标记尾迹">
          <el-slider
            step="0.1"
            v-model="currentDashboard.echarts.lines.effect.trailLength"
            :min="0"
            :max="1"
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
import { BarSeriesOption } from "glaway-bi-model/view/dashboard/chart/BarSeriesOption";
import ValueUnitOption from "./common/ValueUnitOption.vue";
import DetailCard from "@/components/DetailCard.vue";
import ColorPicker from "@/components/color-picker/index.vue";
import SwitchButton from "@/components/SwitchButton.vue";

@Component({
  components: {
    DetailCard,
    ColorPicker,
    SwitchButton,
    ValueUnitOption
  }
})
export default class GeoStyle extends Vue {
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
  formatTooltip(val: number) {
    return val / 100;
  }

  showSwitch = {
    scatter: true,
    scatterEffect: true,
    lines: true,
    linesEffect: true
  };

  symbol =
    "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z";

  symbolList = [
    { key: "none", label: "无" },
    { key: "emptyCircle", label: "空心点" },
    { key: "circle", label: "实心点" },
    { key: "rect", label: "正方形" },
    { key: "roundRect", label: "圆角正方形" },
    { key: "triangle", label: "三角形" },
    { key: "diamond", label: "菱形" },
    { key: "pin", label: "气球" },
    { key: "arrow", label: "箭头" },
    { key: this.symbol, label: "飞机" }
  ];

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
