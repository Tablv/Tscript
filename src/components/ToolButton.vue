<template>
  <el-tooltip effect="dark" :content="title" :placement="placement">
    <button
      class="tool-btn"
      :class="{ 'switch-btn': isSwitchBtn, 'switch-on': isSwitchOn }"
      @click="clickHandler"
    >
      <i :class="iconClass"></i>
    </button>
  </el-tooltip>
</template>

<script lang="ts">
import { Vue, Prop, Emit, Component } from "vue-property-decorator";

@Component
export default class SwitchButton extends Vue {
  @Prop()
  iconClass!: string;

  @Prop()
  title!: string;

  @Prop({ default: "right" })
  placement!: string;

  @Prop({ default: null })
  switchValue!: boolean | null;

  get isSwitchOn() {
    return this.switchValue;
  }

  get isSwitchBtn() {
    return typeof this.switchValue === "boolean";
  }

  @Emit("click")
  clickEmit() {}

  clickHandler() {
    if (this.switchValue !== null) {
      this.$emit("update:switchValue", !this.switchValue);
    } else {
      this.clickEmit();
    }
  }
}
</script>

<style lang="scss" scoped>
$switchAnimationDuration: 0.2s;

.tool-btn {
  margin: 2px;
  padding: 0 6px;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.6);
  transition: background-color .2s;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: rgba(220, 220, 220, 0.6);
  }

  &:active {
    background-color: rgba(200, 200, 200, 0.6);
  }

  i {
    color: map-get($colors, "chart");
  }

  // 开关
  &.switch-btn {
    transition: background-color $switchAnimationDuration;

    i {
      transition: color $switchAnimationDuration;
    }
  }

  // 开关开启
  &.switch-on {
    background-color: map-get($colors, "chart");

    i {
      color: #fff;
    }
  }
}
</style>
