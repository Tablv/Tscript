<template>
  <div class="specific-style-items">
    <el-form-item label="线型">
      <el-select v-model="lineType">
        <el-option value="normal" label="折线"></el-option>
        <el-option value="curve" label="平滑曲线"></el-option>
      </el-select>
    </el-form-item>
  </div>
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

  lineType = "normal";
}
</script>
