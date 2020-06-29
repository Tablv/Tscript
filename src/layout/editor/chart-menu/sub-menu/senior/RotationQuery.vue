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
          @change="doHandleChange"
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
import ReactWhere from "glaway-bi-model/view/ReactWhere";
import ObjectUtil from "@/util/ObjectUtil";

@Component
export default class RotationQuery extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  // 联动
  @CommonStore.State("reactWhere")
  reactWhere!: ReactWhere;

  // 设置联动
  @CommonStore.Mutation("setReactWhere")
  setReactHandle!: Function;

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

  doHandleChange(value: boolean) {
    const reactWhere = ObjectUtil.copy(this.reactWhere);
    reactWhere.rotationTask = {
      ratotionNumb: reactWhere.rotationTask.ratotionNumb,
      ratotionId: this.currentDashboard.tasks.ratotionId,
      ratotionEnable: value
    };

    this.setReactHandle(reactWhere);
  }

  checkInput(value: string | number) {
    if (!parseInt(value as string)) {
      this.currentDashboard.tasks.ratotionNumb = 1;
    } else {
      this.currentDashboard.tasks.ratotionNumb = parseInt(value as string);
    }
    const reactWhere = ObjectUtil.copy(this.reactWhere);
    reactWhere.rotationTask = {
      ratotionNumb: this.currentDashboard.tasks.ratotionNumb,
      ratotionId: this.currentDashboard.tasks.ratotionId,
      ratotionEnable: true
    };
  }
}
</script>

<style lang="scss" scoped></style>
