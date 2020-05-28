<template>
  <dialog-button
    :title="title"
    :icon-class="iconClass"
    :visible.sync="dialogVisible"
    :enable-footer="false"
    width="400px"
    @closed="close"
  >
  </dialog-button>
</template>

<script lang="ts">
import { Vue, Component, Emit, Model, Prop } from "vue-property-decorator";
import DialogButton from "../toolkit/DialogButton.vue";

@Component({
  components: {
    DialogButton
  }
})
export default class TypeChangeView extends Vue {
  @Model("visible")
  visible!: boolean;

  @Prop()
  title!: string;

  @Prop()
  iconClass!: string;

  get dialogVisible() {
    return this.visible;
  }

  set dialogVisible(val: boolean) {
    this.$emit("visible", val);
  }

  @Emit("close")
  close() {}
}
</script>
