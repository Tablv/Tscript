<template>
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
  >
    <template #header>
      <span>事件</span>
    </template>

    <el-form label-position="right" :label-width="elFormLabelWidth">
      <el-form-item label="触发方式">
        <el-select v-model="currentDashboard.events.triggerMethod">
          <el-option
            v-for="(ele, index) in selection.events.method.selection"
            :key="index"
            :label="ele.text"
            :value="ele.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="触发事件">
        <el-select v-model="currentDashboard.events.triggerEvent">
          <el-option
            v-for="(ele, index) in selection.events.event.selection"
            :key="index"
            :label="ele.text"
            :value="ele.value"
          />
        </el-select>
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
export default class Events extends Vue {
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
}
</script>

<style lang="scss" scoped></style>
