<template>
  <div class="specific-style-items">
    <el-form-item label="宽度">
      <el-row>
        <el-col :span="22">
          <el-slider v-model="specificStyle.width" :max="200" :min="1" />
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="高度">
      <el-row>
        <el-col :span="22">
          <el-slider v-model="specificStyle.height" :max="200" :min="0" />
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="图形间距">
      <el-row>
        <el-col :span="22">
          <el-slider v-model="specificStyle.gap" :max="200" :min="0" />
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="边框宽度">
      <el-row>
        <el-col :span="22">
          <el-slider
            v-model="specificStyle.itemStyle.borderWidth"
            :max="200"
            :min="0"
          />
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="边框颜色">
      <el-row>
        <el-col :span="22">
          <color-picker v-model="specificStyle.itemStyle.borderColor" />
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="图形排列">
      <el-row>
        <el-col :span="22">
          <el-select
            v-model="specificStyle.sort"
            placeholder="请选择排列方式"
            popper-class="border-style-selector"
          >
            <el-option value="ascending" label="金字塔"></el-option>
            <el-option value="descending" label="漏斗"></el-option>
          </el-select>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="对齐方式">
      <el-row>
        <el-col :span="22">
          <el-select
            v-model="specificStyle.funnelAlign"
            placeholder="请选择对齐方式"
            popper-class="border-style-selector"
          >
            <el-option value="left" label="左对齐"></el-option>
            <el-option value="right" label="右对齐"></el-option>
            <el-option value="center" label="居中"></el-option>
          </el-select>
        </el-col>
      </el-row>
    </el-form-item>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import { SeriesOption } from "glaway-bi-model/view/dashboard/chart/SeriesOption";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import ColorPicker from "@/components/color-picker/index.vue";

@Component({
  components: {
    ColorPicker
  }
})
export default class FunnelStyle extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @EditorStore.State("styleSelection")
  styleSelection!: any;

  @Inject()
  getSpecificStyle!: Function;

  get specificStyle(): SeriesOption {
    return this.getSpecificStyle();
  }
}
</script>
