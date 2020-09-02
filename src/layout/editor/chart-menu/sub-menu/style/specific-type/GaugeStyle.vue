<template>
  <div class="specific-style-items">
    <!-- 范围配色 -->
    <el-form-item label="范围和配色">
      <switch-button v-model="showSwitch.colorGroup"></switch-button>
    </el-form-item>

    <detail-card :visible="showSwitch.colorGroup">
      <tree-input></tree-input>
    </detail-card>

    <!-- 半径 -->
    <el-form-item label="半径">
      <el-row>
        <el-col :span="22">
          <el-slider v-model="specificStyle.radius" :max="200" :min="1" />
        </el-col>
      </el-row>
    </el-form-item>

    <!-- 坐标轴 -->
    <el-form-item label="坐标轴">
      <!-- <el-switch v-model="showSwitch.axisLine" active-color="#13ce66" /> -->
      <switch-button v-model="showSwitch.axisLine"></switch-button>
    </el-form-item>

    <detail-card :visible="showSwitch.axisLine">
      <el-form-item label="坐标轴线">
        <el-row>
          <el-col :span="22">
            <el-slider
              v-model="specificStyle.axisLine.lineStyle.width"
              :max="100"
              :min="0"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="分隔线">
        <el-row>
          <el-col :span="22">
            <el-slider
              v-model="specificStyle.splitLine.length"
              :max="100"
              :min="0"
            />
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="分隔段数">
        <el-select v-model="specificStyle.splitNumber">
          <el-option
            v-for="(sel, idx) in styleSelection.legend.fontSize.selection"
            :key="idx"
            :label="sel.value"
            :value="sel.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="显示分隔值">
        <el-switch
          v-model="specificStyle.axisLabel.show"
          active-color="#13ce66"
        />
      </el-form-item>
      <el-form-item label="字体">
        <el-select
          v-model="specificStyle.axisLabel.fontFamily"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in styleSelection.label.fontFamily.selection"
            :key="index"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="字体大小">
        <el-select
          v-model="specificStyle.axisLabel.fontSize"
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
            <el-select v-model="specificStyle.axisLabel.color">
              <el-option
                v-for="(item, index) in styleSelection.label.color.selection"
                :key="index"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-col>

          <el-col :span="5" :offset="1" style="height: 32px;">
            <color-picker v-model="specificStyle.axisLabel.color" />
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="刻度线">
        <el-row>
          <el-col :span="22">
            <el-slider
              v-model="specificStyle.axisTick.length"
              :max="100"
              :min="0"
            />
          </el-col>
        </el-row>
      </el-form-item>
    </detail-card>

    <el-form-item label="指针">
      <!-- <el-switch v-model="showSwitch.pointer" active-color="#13ce66" /> -->
      <switch-button v-model="showSwitch.pointer"></switch-button>
    </el-form-item>

    <detail-card :visible="showSwitch.pointer">
      <el-form-item label="指针颜色">
        <el-row>
          <el-col :span="18">
            <el-select v-model="specificStyle.itemStyle.color">
              <el-option
                v-for="(item, index) in styleSelection.label.color.selection"
                :key="index"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-col>

          <el-col :span="5" :offset="1" style="height: 32px;">
            <color-picker v-model="specificStyle.itemStyle.color" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="指针宽度">
        <el-row>
          <el-col :span="22">
            <el-slider
              v-model="specificStyle.pointer.width"
              :max="100"
              :min="0"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="指针长度">
        <el-row>
          <el-col :span="22">
            <el-slider
              v-model="specificStyle.pointer.length"
              :max="100"
              :min="0"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="描边颜色">
        <el-row>
          <el-col :span="18">
            <el-select v-model="specificStyle.itemStyle.borderColor">
              <el-option
                v-for="(item, index) in styleSelection.label.color.selection"
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
      <el-form-item label="描边线宽">
        <el-row>
          <el-col :span="22">
            <el-slider
              v-model="specificStyle.itemStyle.borderWidth"
              :max="100"
              :min="0"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="描边类型">
        <el-row>
          <el-col :span="22">
            <el-select
              v-model="specificStyle.itemStyle.borderType"
              size="mini"
              placeholder="位置"
            >
              <el-option key="solid" label="实线" value="solid" />
              <el-option key="dashed" label="虚线" value="dashed" />
              <el-option key="dotted" label="点状" value="dotted" />
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="阴影颜色">
        <el-row>
          <el-col :span="18">
            <el-select v-model="specificStyle.itemStyle.shadowColor">
              <el-option
                v-for="(item, index) in styleSelection.label.color.selection"
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
      <el-form-item label="阴影模糊度">
        <el-row>
          <el-col :span="22">
            <el-slider
              v-model="specificStyle.itemStyle.shadowBlur"
              :max="100"
              :min="0"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="阴影水平偏移">
        <el-row>
          <el-col :span="22">
            <el-slider
              v-model="specificStyle.itemStyle.shadowOffsetX"
              :max="100"
              :min="0"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="阴影垂直偏移">
        <el-row>
          <el-col :span="22">
            <el-slider
              v-model="specificStyle.itemStyle.shadowOffsetY"
              :max="100"
              :min="0"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <!-- <el-form-item label="透明度">
        <el-row>
          <el-col :span="22">
            <el-slider
              :show-tooltip="false"
              v-model="specificStyle.itemStyle.opacity"
              :max="100"
              :min="0"
            />
          </el-col>
        </el-row>
      </el-form-item> -->
    </detail-card>

    <el-form-item label="角度">
      <switch-button v-model="showSwitch.angle"></switch-button>
    </el-form-item>

    <detail-card :visible="showSwitch.angle">
      <el-form-item label="起始角度">
        <el-row>
          <el-col :span="22">
            <el-slider
              v-model="specificStyle.startAngle"
              :max="360"
              :min="-360"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="结束角度">
        <el-row>
          <el-col :span="22">
            <el-slider
              v-model="specificStyle.endAngle"
              :max="360"
              :min="-360"
            />
          </el-col>
        </el-row>
      </el-form-item>
    </detail-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import DetailCard from "@/components/DetailCard.vue";
import ColorPicker from "@/components/color-picker/index.vue";
import SwitchButton from "@/components/SwitchButton.vue";
import TreeInput from "@/components/TreeInput.vue";

@Component({
  components: {
    DetailCard,
    ColorPicker,
    SwitchButton,
    TreeInput
  }
})
export default class GaugeStyle extends Vue {
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

  showSwitch = {
    colorGroup: false,
    axisLine: false,
    pointer: false,
    angle: false
  };
}
</script>
