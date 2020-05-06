<template>
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <template #header>
      <span>图例</span>
    </template>

    <el-form label-position="right" :label-width="elFormLabelWidth">
      <el-form-item label="显示图例">
        <el-switch
          v-model="currentDashboard.echarts.legend.show"
          active-color="#13ce66"
        />
      </el-form-item>

      <div v-show="currentDashboard.echarts.legend.show">
        <el-form-item label="布局朝向">
          <el-select v-model="currentDashboard.echarts.legend.orient">
            <el-option
              v-for="(sel, idx) in styleSelection.legend.orient.selection"
              :key="idx"
              :label="sel.text"
              :value="sel.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="字体大小">
          <el-select
            v-model="currentDashboard.echarts.legend.textStyle.fontSize"
          >
            <el-option
              v-for="(sel, idx) in styleSelection.legend.fontSize.selection"
              :key="idx"
              :label="sel.text"
              :value="sel.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="位置">
          <el-row>
            <el-col :span="11">
              <el-input
                placeholder="X轴"
                v-model="currentDashboard.echarts.legend.right"
              ></el-input>
            </el-col>
            <el-col :span="12" :offset="1">
              <el-input
                placeholder="Y轴"
                v-model="currentDashboard.echarts.legend.top"
              ></el-input>
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
import Dashboard from "@/model/view/dashboard/Dashboard";

@Component
export default class LegendStyle extends Vue {
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
}
</script>

<style lang="scss" scoped></style>
