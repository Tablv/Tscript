<template>
  <el-button type="text" class="switch-button" @click="handleClick">
    <i :class="getClassGroup"></i>
  </el-button>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";

@Component
export default class SwitchButton extends Vue {
  @Prop()
  value!: boolean;

  get getClassGroup() {
    return {
      "switch-button-font": true,
      "el-icon-arrow-up": this.value,
      "el-icon-arrow-down": !this.value
    };
  }

  handleClick() {
    this.$emit("input", !this.value);
  }
}
</script>

<style lang="scss" scoped>
.switch-button {
  font-size: 12px;
  &-font {
    color: #fff;
    background: #e2e5ec;
    border-radius: 50%;
    padding: 3px;
    padding-top: 4px;
    margin-top: -2px;
    &:hover {
      background: #13ce66;
    }
  }
  .el-icon-arrow-up {
    background: #13ce66;
  }
}
</style>
