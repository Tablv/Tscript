<script lang="ts">
/**
 * 图表样式
 */
import { CreateElement } from "vue";
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import { EChartsSampleStyle } from "glaway-bi-model/view/dashboard/EChartsOption";

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
    bar: () => import("./specific-style/BarStyle.vue"),
    barStack: () => import("./specific-style/BarStyle.vue"),
    barPercentage: () => import("./specific-style/BarStyle.vue"),
    hbar: () => import("./specific-style/BarStyle.vue"),
    hbarStack: () => import("./specific-style/BarStyle.vue"),
    hbarPercentage: () => import("./specific-style/BarStyle.vue"),

    /**
     * 饼图
     */
    pie: () => import("./specific-style/PieStyle.vue"),
    rpie: () => import("./specific-style/PieStyle.vue"),
    rosepie: () => import("./specific-style/PieStyle.vue"),
    sunpie: () => import("./specific-style/PieStyle.vue"),
    targetpie: () => import("./specific-style/PieStyle.vue"),

    /**
     * 雷达图
     */
    radar: () => import("./specific-style/RadarStyle.vue"),

    /**
     * 折线图
     */
    line: () => import("./specific-style/LineStyle.vue"),

    /**
     * 组合图
     */
    biaxial: () => import("./specific-style/LineStyle.vue"),

    /**
     * 仪表盘
     */
    guage: () => import("./specific-style/GuageStyle.vue")
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
