<script lang="tsx">
/**
 * 图表样式
 */
import { CreateElement } from "vue";
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";

@Component({})
export default class MarginStyle extends Vue {
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
    bar: () => import("./margin-type/GridStyle.vue"),
    barStack: () => import("./margin-type/GridStyle.vue"),
    barPercentage: () => import("./margin-type/GridStyle.vue"),
    hbar: () => import("./margin-type/GridStyle.vue"),
    hbarStack: () => import("./margin-type/GridStyle.vue"),
    hbarPercentage: () => import("./margin-type/GridStyle.vue"),

    /**
     * 折线图
     */
    line: () => import("./margin-type/GridStyle.vue"),

    /**
     * 组合图
     */
    biaxial: () => import("./margin-type/GridStyle.vue"),

    /**
     * 饼图
     */
    pie: () => import("./margin-type/CircleStyle.vue"),
    rpie: () => import("./margin-type/CircleStyle.vue"),
    rosepie: () => import("./margin-type/CircleStyle.vue"),
    sunpie: () => import("./margin-type/CircleStyle.vue"),
    targetpie: () => import("./margin-type/CircleStyle.vue"),

    /**
     * 雷达图
     */
    radar: () => import("./margin-type/CircleStyle.vue"),

    /**
     * 仪表盘
     */
    gauge: () => import("./margin-type/CircleStyle.vue"),

    /**
     * 漏斗图
     */
    funnel: () => import("./margin-type/CircleStyle.vue"),

    /**
     * 地图
     */
    map: () => import("./margin-type/CircleStyle.vue")
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
        <span slot="header">数据轴</span>
        <specific />
      </el-card>
    );
  }
}
</script>

<style lang="scss" scoped></style>
