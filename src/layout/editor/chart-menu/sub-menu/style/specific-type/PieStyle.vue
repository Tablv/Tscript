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
        <div style="height: 32px;">
          <el-color-picker
            v-model="currentDashboard.visualData.background"
            :show-alpha="true"
            color-format="hex"
            size="mini"
          />
        </div>
      </el-form-item>

      <el-form-item label="边框">
        <el-switch v-model="borderFlag" active-color="#13ce66" />
      </el-form-item>
      <div v-show="borderFlag">
        <el-form-item label="颜色">
          <div style="height: 32px;">
            <el-color-picker
              v-model="currentDashboard.visualData.borderColor"
              :show-alpha="true"
              color-format="hex"
              size="mini"
            />
          </div>
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
      <el-form-item label="半径(外)">
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
      <el-form-item label="半径(内)">
        <el-row>
          <el-col :span="22">
            <el-slider
              v-model="specificStyle.radiusConfig.inside"
              :max="200"
              :min="0"
            />
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import ColorOption from "../common/ColorOption.vue";

@Component({
  components: {
    ColorOption
  }
})
export default class PieStyle extends Vue {
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

  borderFlag: boolean = false;
}
</script>
