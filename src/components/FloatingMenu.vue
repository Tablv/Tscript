<template>
  <div class="menu">
    <div class="menu-header">
      <div class="title" v-if="$slots.title || title">
        <span v-if="title">{{ title }}</span>
        <slot v-else name="title"></slot>
      </div>
      <div class="tool">
        <slot name="tool"></slot>
      </div>
    </div>

    <div class="menu-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";

@Component
export default class FloatingMenu extends Vue {
  @Prop()
  title!: string;
}
</script>

<style lang="scss">
$headerHeight: 40px;

.menu {
  user-select: none;
  border-left: 1px solid #ccc;
  padding-right: 3px;

  .menu-header {
    @include select(none);
    height: $headerHeight;
    position: relative;

    > .title {
      text-align: center;
      font-size: 14px;
      line-height: $headerHeight;
    }

    > .tool {
      position: absolute;
      top: 3px;
      right: 6px;
    }
  }

  .menu-content {
    width: 100%;
    height: calc(100% - #{$headerHeight} - 60px);
    overflow: auto;
  }
}
</style>
