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

      <detail-card :visible="borderFlag">
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
import ColorOption from "./common/ColorOption.vue";

@Component({
  components: {
    DetailCard,
    ColorOption
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

  borderFlag = false;
}
</script>

<style lang="scss" scoped></style>
