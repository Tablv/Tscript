<template>
  <div class="detail-card-wrap">
    <el-collapse-transition>
      <div v-show="visible" class="detail-card">
        <slot></slot>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class DetailCard extends Vue {
  @Prop()
  visible!: boolean;
}
</script>

<style lang="scss">
.detail-card-wrap {
  box-sizing: content-box;
  padding: 0 16px;

  + .el-form-item {
    margin-top: 18px;
  }
}

.detail-card {
  box-sizing: content-box;
  background: #fff;
  border: 1px solid #e3e3e3;
  border-radius: 6px;
  padding: 10px 10px 0;

  > * {
    margin-left: -16px;
  }
}
</style>
