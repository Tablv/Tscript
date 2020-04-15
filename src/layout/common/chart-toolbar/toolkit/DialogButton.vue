<template>
  <span class="dialog-button">
    <tool-button
      :title="title"
      :icon-class="iconClass"
      @click="openDialog"
    />

    <el-dialog
      :visible.sync="dialogVisible"
      :width="width"
      custom-class="dialog-button-dialog"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      append-to-body
      @open="openHandle"
      @closed="closedHandle"
    >
      <div class="dialog-header-box" slot="title">
        <i :class="iconClass"></i>
        <span>{{ title }}</span>
      </div>
      <slot name="dialog-content"></slot>
      <span v-if="enableFooter" slot="footer">
        <slot name="dialog-footer"></slot>
      </span>
    </el-dialog>
  </span>
</template>

<script lang="ts">
import { Vue, Prop, Emit, Component } from "vue-property-decorator";
import ToolButton from "@/components/ToolButton.vue";

@Component({
  components: {
    ToolButton
  }
})
export default class DialogButton extends Vue {
  @Prop()
  visible!: boolean;

  @Prop()
  title!: string;

  @Prop()
  iconClass!: string;

  @Prop({ default: "30%" })
  width!: string;

  @Prop({ default: true })
  enableFooter!: boolean;

  @Emit("open")
  openHandle() {}

  @Emit("closed")
  closedHandle() {}

  get dialogVisible() {
    return this.visible;
  }

  set dialogVisible(val: boolean) {
    this.$emit("update:visible", val);
  }

  openDialog(): void {
    this.dialogVisible = true;
  }
}
</script>

<style lang="scss">
.dialog-button {
  display: inline-block;
}

.dialog-button-dialog {
  transition: width 0.3s ease 0s;
}

.dialog-header-box {
  i {
    margin-right: 10px;
  }
}
</style>
