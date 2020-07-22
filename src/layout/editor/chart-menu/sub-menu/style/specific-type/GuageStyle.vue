<template>
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <template #header>
      <span>图表样式</span>
    </template>

    <el-form label-position="right" :label-width="elFormLabelWidth">
      <!-- 配色部分 -->
      <color-option />

      <el-form-item label="背景色">
        <el-row>
          <el-col :span="5" :offset="1" style="height: 32px;">
            <el-color-picker
              v-model="currentDashboard.visualData.background"
              :show-alpha="true"
              color-format="hex"
              size="mini"
            />
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="边框">
        <el-switch v-model="borderFlag" active-color="#13ce66" />
      </el-form-item>
      <div v-show="borderFlag">
        <el-form-item label="颜色">
          <el-row>
            <el-col :span="5" :offset="1" style="height: 32px;">
              <el-color-picker
                v-model="currentDashboard.visualData.borderColor"
                :show-alpha="true"
                color-format="hex"
                size="mini"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="样式">
          <el-row>
            <el-col :span="12" :offset="1" style="height: 32px;">
              <el-select v-model="currentDashboard.visualData.borderStyle">
                <el-option key="dotted" label="点状" value="dotted" />
                <el-option key="solid" label="实线" value="solid" />
                <el-option key="double" label="双线" value="double" />
                <el-option key="dashed" label="虚线" value="dashed" />
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="宽度">
          <el-row>
            <el-col :span="12" :offset="1" style="height: 32px;">
              <el-select v-model="currentDashboard.visualData.borderWidth">
                <el-option
                  v-for="(sel, idx) in styleSelection.legend.fontSize.selection"
                  :key="idx"
                  :label="sel.value"
                  :value="sel.value"
                />
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="圆角">
          <el-row>
            <el-col :span="12" :offset="1" style="height: 32px;">
              <el-slider
                class="grid-card-font-size"
                v-model="currentDashboard.visualData.borderRadius"
                :max="50"
                :min="0"
              />
            </el-col>
          </el-row>
        </el-form-item>
      </div>

      <!-- 半径 -->
      <el-form-item label="半径">
        <el-row>
          <el-col :span="22">
            <el-slider
              v-model="specificStyle.radiusConfig.outside"
              :max="200"
              :min="1"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="坐标轴">
        <el-switch v-model="showSwitch.axisLine" active-color="#13ce66" />
      </el-form-item>
      <div v-show="showSwitch.axisLine">
        <el-form-item label="坐标轴线">
          <el-row>
            <el-col :span="22">
              <el-slider
                v-model="specificStyle.radiusConfig.axisLineWidth"
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
        <el-form-item label="小标记">
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
        <el-form-item label="分割段数">
          <el-select v-model="specificStyle.splitNumber">
            <el-option
              v-for="(sel, idx) in styleSelection.legend.fontSize.selection"
              :key="idx"
              :label="sel.value"
              :value="sel.value"
            />
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="指针">
        <el-switch v-model="showSwitch.pointer" active-color="#13ce66" />
      </el-form-item>
      <div v-show="showSwitch.pointer">
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
      </div>
      <el-form-item label="角度">
        <el-switch v-model="showSwitch.angle" active-color="#13ce66" />
      </el-form-item>
      <div v-show="showSwitch.angle">
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
      </div>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import ColorOption from "../common/ColorOption.vue";
import { ChartOption } from "glaway-bi-model/view/dashboard/chart/ChartOption";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";

@Component({
  components: {
    ColorOption
  }
})
export default class GuageStyle extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @EditorStore.State("styleSelection")
  styleSelection!: any;

  @Inject()
  boxCardBodyStyle!: Properties;

  @Inject()
  boxCardShadow!: string;

  @Inject()
  elFormLabelWidth!: string;

  // 基础样式配置
  @Inject()
  getSpecificStyle!: Function;

  get specificStyle() {
    return this.getSpecificStyle();
  }

  showSwitch = {
    axisLine: false,
    pointer: false,
    angle: false
  };

  borderFlag: boolean = false;
}
</script>

<style lang="scss" scoped>
.position-lable {
  position: absolute;
  z-index: 10;
  left: -34px;
  font-size: 13px;
  color: #606266;
}
</style>
