<script lang="tsx">
/**
 * 图表样式
 */
import { CreateElement } from "vue";
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import { EChartsSampleStyle } from "glaway-bi-model/view/dashboard/EChartsOption";
import ColorOption from "./common/ColorOption.vue";

@Component({
  components: {
    ColorOption
  }
})
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

  readonly specificMap = {
    /**
     * 柱图
     */
    bar: () => import("./specific-type/BarStyle.vue"),
    barStack: () => import("./specific-type/BarStyle.vue"),
    barPercentage: () => import("./specific-type/BarStyle.vue"),
    hbar: () => import("./specific-type/BarStyle.vue"),
    hbarStack: () => import("./specific-type/BarStyle.vue"),
    hbarPercentage: () => import("./specific-type/BarStyle.vue"),

    /**
     * 饼图
     */
    pie: () => import("./specific-type/PieStyle.vue"),
    rpie: () => import("./specific-type/PieStyle.vue"),
    rosepie: () => import("./specific-type/PieStyle.vue"),
    sunpie: () => import("./specific-type/PieStyle.vue"),
    targetpie: () => import("./specific-type/TargetPieStyle.vue"),

    /**
     * 雷达图
     */
    radar: () => import("./specific-type/RadarStyle.vue"),

    /**
     * 折线图
     */
    line: () => import("./specific-type/LineStyle.vue"),

    /**
     * 组合图
     */
    biaxial: () => import("./specific-type/LineStyle.vue"),

    /**
     * 仪表盘
     */
    gauge: () => import("./specific-type/GaugeStyle.vue"),

    /**
     * 漏斗图
     */
    funnel: () => import("./specific-type/FunnelStyle.vue")
  };

  get chartType() {
    return this.currentDashboard.visualData.type;
  }

  render(h: CreateElement) {
    // 通过图表类型，获取对应的样式配置
    const specific = this.specificMap[this.chartType];

    return (
      <el-card
        class="box-card"
        body-style={this.boxCardBodyStyle}
        shadow={this.boxCardShadow}
      >
        <span slot="header">图表样式</span>

        {/* 表单 */}
        <el-form label-position="right" label-width={this.elFormLabelWidth}>
          {/* 配色部分 */}
          <color-option />

          <specific />
        </el-form>
      </el-card>
    );
  }
}
</script>

<style lang="scss" scoped></style>
