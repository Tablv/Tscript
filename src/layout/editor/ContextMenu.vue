<script lang="tsx">
import { Vue, Component, Prop } from "vue-property-decorator";
import { CreateElement, VNode, VNodeData } from "vue";
import clickoutside from "element-ui/src/utils/clickoutside";

@Component({
  directives: { clickoutside }
})
export default class ContextMenu extends Vue {
  @Prop({ default: false })
  visible!: boolean;

  @Prop({
    default: () => {
      return {
        transform: "translate(0, 0)"
      };
    }
  })
  position!: { transform: string };

  @Prop({ default: true })
  hideOnClick!: boolean;

  render(h: CreateElement) {
    if (!this.visible) return null;

    return (
      <ul
        v-clickoutside={this.closeMenu}
        class="gw-context-menu"
        style={this.position}
      >
        {this.menuItemsRenderer(h)}
      </ul>
    );
  }

  menuItemsRenderer(h: CreateElement): Array<VNode> {
    const list = this.$slots.default?.reduce(
      (nodesList: Array<VNode>, node: VNode) => {
        const $data = (node.data || {}) as VNodeData;
        const $attrs = $data?.attrs;

        // 添加className
        $data.class = $data.class ? ($data.class += " menu-item") : "menu-item";

        // VNode 处理
        if ($data && $attrs) {
          if ($attrs?.hasOwnProperty("divided")) {
            delete $attrs.divided;
            nodesList.push(this.menuDividerRenderer(h));
          }

          if ($attrs?.hasOwnProperty("disabled")) {
            $data.class += " is-disabled";
          }
        }

        // 代理事件
        this.eventProxyHandler(node.data as VNode, node.context as Vue);

        nodesList.push(node);

        return nodesList;
      },
      []
    );

    return list || [];
  }

  menuDividerRenderer(h: CreateElement) {
    return <li class="menu-item-divider"></li>;
  }

  // get positionStyle() {
  //   return {
  //     top: this.position.top + "px",
  //     left: this.position.left + "px"
  //   };
  // }

  /**
   * 事件代理
   */
  eventProxyHandler(data: VNodeData, context: Vue) {
    const events = data.on;
    if (!events) return;

    Object.entries(events).forEach(([eventName, fn]) => {
      const originEvents =
        typeof events[eventName] === "function"
          ? [events[eventName]]
          : (events[eventName] as Array<Function>);

      events[eventName] = () => {
        originEvents.forEach((event: any) => {
          event.call(context);
        });

        this.clickPostHandle();
      };
    });
  }

  clickPostHandle() {
    if (this.hideOnClick) {
      this.closeMenu();
    }
  }

  mounted() {
    document.body.appendChild(this.$el);
  }

  closeMenu() {
    this.$emit("update:visible", false);
  }
}
</script>

<style lang="scss">
// background-color: rgb(13,118,253);
//     color: #fff;

.gw-context-menu {
  position: absolute;
  background-color: rgba(236, 236, 236, 0.6);
  backdrop-filter: blur(20px);
  user-select: none;
  padding: 6px;
  border: 1px solid #e4e4e4;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  z-index: 3000;

  .menu-item {
    list-style: none;
    margin: 0;
    line-height: 27px;
    padding: 0 15px;
    font-size: 13px;
    color: #4a4b50;
    border-radius: 4px;

    &:hover {
      background-color: #0d76fd;
      color: #fff;
    }
  }

  .menu-item-divider {
    height: 1px;
    background: rgba(219, 219, 219, 0.6);
    margin: 4px 6px 2px;
    backdrop-filter: blur(10px);
  }
}
</style>
