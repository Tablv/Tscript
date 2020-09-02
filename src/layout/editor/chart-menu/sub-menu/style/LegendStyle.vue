<template>
  <!-- 图例 -->
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
    v-show="!specificStyle.pointer"
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

      <detail-card :visible="currentDashboard.echarts.legend.show">
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
      </detail-card>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import DetailCard from "@/components/DetailCard.vue";
import { SeriesOption } from "glaway-bi-model/view/dashboard/chart/SeriesOption";

@Component({
  components: {
    DetailCard
  }
})
export default class LegendStyle extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @EditorStore.State("styleSelection")
  styleSelection!: Object;

  @Inject()
  getSpecificStyle!: Function;

  get specificStyle(): SeriesOption {
    return this.getSpecificStyle();
  }

  @Inject()
  boxCardBodyStyle!: Properties;

  @Inject()
  elFormLabelWidth!: string;

  @Inject()
  boxCardShadow!: string;
}
</script>

<style lang="scss" scoped></style>
