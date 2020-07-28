<script lang="ts">
/**
 * 图表样式
 */
import { CreateElement } from "vue";
import { Component, Vue } from "vue-property-decorator";
import { CommonStore } from "@/store/modules-model";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";

@Component
export default class TitleStyle extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  readonly componentRegistry = {
    /**
     * 柱图
     */
    bar: () => import("./axis-type/BarAxis.vue"),
    barStack: () => import("./axis-type/BarAxis.vue"),
    barPercentage: () => import("./axis-type/BarAxis.vue"),
    hbar: () => import("./axis-type/BarAxis.vue"),
    hbarStack: () => import("./axis-type/BarAxis.vue"),
    hbarPercentage: () => import("./axis-type/BarAxis.vue"),

    /**
     * 饼图
     */
    pie: () => import("./axis-type/PieAxis.vue"),
    rpie: () => import("./axis-type/PieAxis.vue"),
    rosepie: () => import("./axis-type/PieAxis.vue"),
    sunpie: () => import("./axis-type/PieAxis.vue"),

    /**
     * 雷达图
     */
    radar: () => import("./axis-type/BarAxis.vue"),

    /**
     * 折线图
     */
    line: () => import("./axis-type/PieAxis.vue"),

    /**
     * 组合图
     */
    biaxial: () => import("./axis-type/PieAxis.vue"),

    /**
     * 指示器 仪表盘
     */
    targetpie: () => import("./axis-type/GuageAxis.vue"),
    guage: () => import("./axis-type/GuageAxis.vue"),
    funnel: () => import("./axis-type/PieAxis.vue")
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
