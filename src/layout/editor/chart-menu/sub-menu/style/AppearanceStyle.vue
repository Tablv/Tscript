<template>
  <!-- 外观样式 -->
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <template #header>
      <span>外观样式</span>
    </template>

    <el-form label-position="right" :label-width="elFormLabelWidth">
      <el-form-item label="背景色">
        <div style="height: 32px;">
          <el-color-picker
            v-model="currentDashboard.visualData.background.color"
            :show-alpha="true"
            color-format="hex"
            size="mini"
          />
        </div>
      </el-form-item>

      <el-form-item label="边框">
        <el-switch v-model="borderFlag" active-color="#13ce66" />
      </el-form-item>

      <detail-card :visible="borderFlag">
        <el-form-item label="宽度">
          <!-- 宽度 -->
          <el-slider
            v-model="currentDashboard.visualData.border.width"
            :min="1"
            :max="10"
          ></el-slider>
        </el-form-item>

        <el-form-item label="样式">
          <!-- 样式 -->
          <el-select
            v-model="currentDashboard.visualData.border.style"
            placeholder="请选择边框样式"
            popper-class="border-style-selector"
          >
            <el-option
              v-for="option in borderStyleOptions"
              :key="option.value"
              :value="option.value"
              :label="option.label"
            >
              <span
                class="border-style-example"
                :style="{ 'border-style': option.value }"
              ></span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="颜色">
          <!-- 颜色 -->
          <div style="height: 32px;">
            <el-color-picker
              v-model="currentDashboard.visualData.border.color"
              :show-alpha="true"
              color-format="hex"
              size="mini"
            />
          </div>
        </el-form-item>

        <el-form-item label="圆角">
          <!-- 圆角 -->
          <el-slider
            v-model="currentDashboard.visualData.border.radius"
            class="width-slider"
            :min="0"
            :max="100"
          ></el-slider>
        </el-form-item>
      </detail-card>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Inject, Model } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import DetailCard from "@/components/DetailCard.vue";

@Component({
  components: {
    DetailCard
  }
})
export default class DataStyle extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @EditorStore.State("styleSelection")
  styleSelection!: Object;

  @Inject()
  boxCardBodyStyle!: Properties;

  @Inject()
  elFormLabelWidth!: string;

  @Inject()
  boxCardShadow!: string;

  borderStyleOptions = [
    { value: "dotted", label: "点状" },
    { value: "solid", label: "实线" },
    { value: "double", label: "双线" },
    { value: "dashed", label: "虚线" }
  ];

  borderFlag = false;
}
</script>

<style lang="scss">
.border-style-selector {
  width: 120px;

  .border-style-example {
    display: inline-block;
    width: 100%;
    border-width: 3px 0 0;
    margin-bottom: 3px;
  }
}
</style>
