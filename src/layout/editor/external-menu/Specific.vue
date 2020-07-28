<script lang="tsx">
import { Vue, Component } from "vue-property-decorator";

import TextStyle from "./menu-card/TextStyle.vue";
import { CommonStore } from '@/store/modules-model';
import { DashWidget } from '@/types/DashWidget';
import { CreateElement } from 'vue';
import { WidgetType } from '@/config/WidgetType';

@Component({
  components: {
    TextStyle
  }
})
export default class specificMenuItems extends Vue {
  // 当前仪表盘
  @CommonStore.Getter("currentDashboard")
  currentWidget!: DashWidget<any>;

  render(h: CreateElement) {
    const type = this.currentWidget?.type;

    return this.renderByType(type);
  }

  renderByType(type: WidgetType | null) {
    switch(type) {
      case WidgetType.TEXT_AREA: {
        return (
          <div>
            <TextStyle />
          </div>
        );
      }

      case WidgetType.IMAGE: {
        return (
          <div>
            {/* Image */}
          </div>
        );
      }
    }

    return null;
  }
}
</script>