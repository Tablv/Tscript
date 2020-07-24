<template>
  <el-form label-position="right" :label-width="elFormLabelWidth">
    <el-form-item label="线型">
      <el-select>
        <el-option>折线</el-option>
        <el-option>平滑曲线</el-option>
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import DetailCard from "@/components/DetailCard.vue";

@Component({
  components: {
    DetailCard
  }
})
export default class BarStyle extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @EditorStore.State("styleSelection")
  styleSelection!: any;

  @Inject()
  boxCardBodyStyle!: Properties;

  @Inject()
  boxCardShadow!: string;

  @Inject()
  elFormLabelWidth!: string;
}
</script>
