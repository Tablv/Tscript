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
import { Vue, Component, Emit } from "vue-property-decorator";
import DialogButton from "../toolkit/DialogButton.vue";

@Component({
  components: {
    DialogButton
  }
})
export default class SortIndexView extends Vue {
  @Emit("close")
  close() {}
}
</script>
