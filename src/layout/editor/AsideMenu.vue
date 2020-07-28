<script lang="ts">
import { CreateElement } from "vue";
import { Vue, Component } from "vue-property-decorator";
import { CommonStore } from "@/store/modules-model";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import { widgetConfig, DashWidget } from "@/types/DashWidget";

@Component({
  components: {
    ChartMenu: () => import("./chart-menu/index.vue"),
    ExternalMenu: () => import("./external-menu/index.vue")
  }
})
export default class AsideMenu extends Vue {
  // 当前仪表盘
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard | DashWidget<any>;

  render(h: CreateElement) {
    if (!this.currentDashboard) return null;

    const menuComponent = (this.currentDashboard as any).type
      ? "external-menu"
      : "chart-menu";
    return h(menuComponent);
  }
}
</script>
