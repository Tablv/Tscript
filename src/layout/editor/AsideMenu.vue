<script lang="ts">
import { CreateElement } from "vue";
import { Vue, Component } from "vue-property-decorator";
import { CommonStore } from "@/store/modules-model";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import { widgetConfig, DashWidget } from "@/types/DashWidget";

@Component({
  components: {
    "text-menu": () => import("./external-menu/TextMenu.vue"),
    "img-menu": () => import("./external-menu/ImageMenu.vue"),
    "dashboard-menu": () => import("./chart-menu/index.vue")
  }
})
export default class AsideMenu extends Vue {
  // 当前仪表盘
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard | DashWidget<any>;

  render(h: CreateElement) {
    if (!this.currentDashboard) return null;

    const type = (this.currentDashboard as any).type || "dashboard";
    return h(`${type}-menu`);
  }
}
</script>
