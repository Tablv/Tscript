<template>
  <el-form-item label="配色方案">
    <el-row>
      <el-col>
        <el-dropdown
          size="mini"
          trigger="click"
          :hide-on-click="false"
          @command="setGlobalColor"
        >
          <span class="el-dropdown-link">
            <color-gallery
              :limit="5"
              :colors="currentDashboard.echarts.sampleStyle.global.color"
            ></color-gallery>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(colors, selIndex) in styleSelection.color.selection"
              :key="selIndex"
              :command="colors"
            >
              <color-gallery
                :padding="2"
                :size="12"
                :colors="colors"
              ></color-gallery>
            </el-dropdown-item>
            <el-dropdown-item :command="null">自定义配色</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>

    <!-- 配色选框 -->
    <el-dialog
      title="自定义配色方案"
      append-to-body
      :visible.sync="showCustomizedColorDialog"
    >
      <div class="color-gallery">
        <span
          class="color-block"
          v-for="(colorVal, colorIndex) in currentDashboard.echarts.sampleStyle
            .global.color"
          :key="colorIndex"
        >
          <el-color-picker
            v-model="
              currentDashboard.echarts.sampleStyle.global.color[colorIndex]
            "
          ></el-color-picker>
        </span>
      </div>
    </el-dialog>
  </el-form-item>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import ColorGallery, { ColorsModel } from "@/components/ColorGallery.vue";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";

@Component({
  components: {
    ColorGallery
  }
})
export default class ColorOption extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @EditorStore.State("styleSelection")
  styleSelection!: Object;

  showCustomizedColorDialog = false;

  /**
   * ColorGallery Callback
   */
  setGlobalColor(colorArr: Array<string> | ColorsModel | null): void {
    // 传入配色数据
    if (colorArr) {
      // 数组直接赋值
      if (colorArr instanceof Array) {
        this.currentDashboard.echarts.sampleStyle.global.color = colorArr;
      } else {
        // 对象 取colors属性
        this.currentDashboard.echarts.sampleStyle.global.color =
          colorArr.colors;
      }
    } else {
      this.showCustomizedColorDialog = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dropdown-menu {
  @include select(none);
}

// 解决配色预览条与下拉箭头对其问题
.el-dropdown-link > * {
  vertical-align: middle;
}
</style>
