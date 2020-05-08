<!-- <template> -->
<!-- <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <template #header>
      <span>标题</span>
    </template>

    <el-form label-position="right" :label-width="elFormLabelWidth">
      <el-form-item label="标题">
        <el-input clearable v-model="currentDashboard.echarts.title.text" />
      </el-form-item>

      <el-form-item label="字体">
        <el-select
          v-model="currentDashboard.echarts.title.textStyle.fontFamily"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in styleSelection.title.fontFamily.selection"
            :key="index"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="字体大小">
        <el-select
          v-model="currentDashboard.echarts.title.textStyle.fontSize"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in styleSelection.title.size.selection"
            :key="index"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="字体颜色">
        <el-row>
          <el-col :span="18">
            <el-select v-model="currentDashboard.echarts.title.textStyle.color">
              <el-option
                v-for="(item, index) in styleSelection.title.color.selection"
                :key="index"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-col>

          <el-col :span="5" :offset="1" style="height: 32px;">
            <el-color-picker
              v-model="currentDashboard.echarts.title.textStyle.color"
            />
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="对齐方式">
        <el-radio-group v-model="currentDashboard.echarts.title.left">
          <el-radio-button
            :key="idx"
            v-for="(sel, idx) in styleSelection.title.left.selection"
            :label="sel.value"
            >{{ sel.text }}</el-radio-button
          >
        </el-radio-group>
      </el-form-item>
    </el-form>
  </el-card> -->
<!-- </template> -->

<script lang="ts">
import { CreateElement } from "vue";
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "@/model/view/dashboard/Dashboard";
import { EChartsSampleStyle } from "@/model/view/dashboard/EChartsOption";

@Component
export default class TitleStyle extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @EditorStore.State("styleSelection")
  styleSelection!: Object;

  @Inject()
  boxCardBodyStyle!: Properties;

  @Inject()
  boxCardShadow!: string;

  @Inject()
  elFormLabelWidth!: string;

  readonly componentRegistry = {
    /**
     * 柱图
     */
    bar: () => import("./custom-style/BarStyle.vue"),
    barStack: () => import("./custom-style/BarStyle.vue"),
    barPercentage: () => import("./custom-style/BarStyle.vue"),
    hbar: () => import("./custom-style/BarStyle.vue"),
    hbarStack: () => import("./custom-style/BarStyle.vue"),
    hbarPercentage: () => import("./custom-style/BarStyle.vue"),

    /**
     * 饼图
     */
    pie: () => import("./custom-style/PieStyle.vue"),
    rpie: () => import("./custom-style/PieStyle.vue"),
    rosepie: () => import("./custom-style/PieStyle.vue"),
    sunpie: () => import("./custom-style/PieStyle.vue"),
    targetpie: () => import("./custom-style/PieStyle.vue"),
    radar: () => import("./custom-style/PieStyle.vue"),

    /**
     * 折线图
     */
    line: () => import("./custom-style/LineStyle.vue"),

    /**
     * 组合图
     */
    biaxial: () => import("./custom-style/LineStyle.vue"),

    /**
     * 仪表盘
     */
    guage: () => import("./custom-style/PieStyle.vue")
  };

  get chartType() {
    return this.currentDashboard.visualData.type;
  }

  render(createElement: CreateElement) {
    // 通过图表类型，获取对应的样式配置
    const component = this.componentRegistry[this.chartType];
    return createElement(component);
  }
}
</script>

<style lang="scss" scoped></style>
