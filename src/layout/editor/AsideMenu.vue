<script lang="ts">
import { CreateElement } from 'vue';
import { Vue, Component } from "vue-property-decorator";
import { CommonStore } from "@/store/modules-model";
// import ChartMenu from "@/layout/editor/chart-menu/index.vue";
// import TextMenu from "@/layout/editor/text-menu/index.vue";
import Dashboard from 'glaway-bi-model/view/dashboard/Dashboard';
import { widgetConfig, DashWidget } from '../../types/DashWidget';

@Component({
  components: {
    text: () => import("./text-menu/index.vue"),
    image: () => import("./text-menu/index.vue"),
    default: () => import("./chart-menu/index.vue")
  }
})
export default class AsideMenu extends Vue {
  // 当前仪表盘
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard | DashWidget<any>;

  render(h: CreateElement) {
    if (!this.currentDashboard) return null;

    const type = (this.currentDashboard as any).type || "default";
    return h(type);
  }
}
</script>