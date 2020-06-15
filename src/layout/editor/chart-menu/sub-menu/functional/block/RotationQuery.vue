<template>
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <template #header>
      <span>轮播查询</span>
    </template>

    <el-form label-position="right" :label-width="elFormLabelWidth">
      <el-form-item label="开启轮播">
        <el-switch
          active-color="#13ce66"
          v-model="currentDashboard.tasks.ratotionEnable"
        />
      </el-form-item>

      <el-form-item label="轮播间隔(秒)">
        <el-input
          clearable
          v-model="currentDashboard.tasks.ratotionNumb"
          :disabled="!InputAble"
          @input="checkInput"
        />
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";

@Component
export default class RotationQuery extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @EditorStore.State("styleSelection")
  selection!: Object;

  @Inject()
  boxCardBodyStyle!: Properties;

  @Inject()
  boxCardShadow!: string;

  @Inject()
  elFormLabelWidth!: string;

  get InputAble() {
    return this.currentDashboard.tasks.ratotionEnable;
  }

  checkInput(value: string | number) {
    if (!parseInt(value as string)) {
      this.currentDashboard.tasks.ratotionNumb = 1;
    } else {
      this.currentDashboard.tasks.ratotionNumb = parseInt(value as string);
    }
  }
}
</script>

<style lang="scss" scoped></style>
