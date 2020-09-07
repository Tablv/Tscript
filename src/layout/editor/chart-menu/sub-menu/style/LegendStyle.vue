<template>
  <!-- 图例 -->
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
    v-if="currentDashboard.echarts.legend"
  >
    <template #header>
      <span>图例</span>
    </template>

    <el-form label-position="right" :label-width="elFormLabelWidth">
      <el-form-item label="显示图例">
        <el-switch v-model="legend.show" active-color="#13ce66" />
      </el-form-item>

      <el-form-item label="背景色">
        <el-row>
          <el-col :span="18">
            <el-select v-model="legend.backgroundColor">
              <el-option
                v-for="(item, index) in styleSelection.title.color.selection"
                :key="index"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-col>

          <el-col :span="5" :offset="1" style="height: 32px;">
            <color-picker v-model="legend.backgroundColor" />
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="布局朝向">
        <el-select v-model="legend.orient">
          <el-option
            v-for="(sel, idx) in styleSelection.legend.orient.selection"
            :key="idx"
            :label="sel.text"
            :value="sel.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="对齐方式">
        <el-select v-model="legend.algin">
          <el-option key="auto" label="自动" value="auto" />
          <el-option key="left" label="左对齐" value="left" />
          <el-option key="right" label="右对齐" value="right" />
        </el-select>
      </el-form-item>

      <!-- 图例块 -->
      <el-form-item label="图例块">
        <switch-button v-model="showSwitch.legend"></switch-button>
      </el-form-item>
      <detail-card :visible="showSwitch.legend">
        <el-form-item label="图例间距">
          <el-input v-model="legend.itemGap"></el-input>
        </el-form-item>

        <el-form-item label="图例宽度">
          <el-slider v-model="legend.itemWidth" :min="0" />
        </el-form-item>

        <el-form-item label="图例高度">
          <el-slider v-model="legend.itemHeight" :min="0" />
        </el-form-item>
      </detail-card>

      <!-- 文本框 -->
      <el-form-item label="文本框">
        <switch-button v-model="showSwitch.textInput"></switch-button>
      </el-form-item>
      <detail-card :visible="showSwitch.textInput">
        <el-form-item label="背景色">
          <el-row>
            <el-col :span="18">
              <el-select v-model="legend.textStyle.backgroundColor">
                <el-option
                  v-for="(item, index) in styleSelection.title.color.selection"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-col>

            <el-col :span="5" :offset="1" style="height: 32px;">
              <color-picker v-model="legend.textStyle.backgroundColor" />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="边框颜色">
          <el-row>
            <el-col :span="18">
              <el-select v-model="legend.textStyle.borderColor">
                <el-option
                  v-for="(item, index) in styleSelection.title.color.selection"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-col>

            <el-col :span="5" :offset="1" style="height: 32px;">
              <color-picker v-model="legend.textStyle.borderColor" />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="边框宽度">
          <el-slider v-model="legend.textStyle.borderWidth" :min="0" />
        </el-form-item>

        <el-form-item label="边框圆角">
          <el-slider v-model="legend.textStyle.borderRadius" :min="0" />
        </el-form-item>

        <el-form-item label="阴影颜色">
          <el-row>
            <el-col :span="18">
              <el-select v-model="legend.textStyle.shadowColor">
                <el-option
                  v-for="(item, index) in styleSelection.title.color.selection"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-col>

            <el-col :span="5" :offset="1" style="height: 32px;">
              <color-picker v-model="legend.textStyle.shadowColor" />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="阴影大小">
          <el-slider v-model="legend.textStyle.shadowBlur" :min="0" />
        </el-form-item>

        <el-form-item label="水平偏移">
          <el-slider v-model="legend.textStyle.shadowOffsetX" :min="-100" />
        </el-form-item>

        <el-form-item label="垂直偏移">
          <el-slider v-model="legend.textStyle.shadowOffsetY" :min="-100" />
        </el-form-item>

        <el-form-item label="上边距">
          <el-slider v-model="legend.textStyle.padding[0]" :min="0" />
        </el-form-item>

        <el-form-item label="右边距">
          <el-slider v-model="legend.textStyle.padding[1]" :min="0" />
        </el-form-item>

        <el-form-item label="下边距">
          <el-slider v-model="legend.textStyle.padding[2]" :min="0" />
        </el-form-item>

        <el-form-item label="左边距">
          <el-slider v-model="legend.textStyle.padding[3]" :min="0" />
        </el-form-item>
      </detail-card>

      <!-- 字体 -->
      <el-form-item label="字体">
        <switch-button v-model="showSwitch.text"></switch-button>
      </el-form-item>
      <detail-card :visible="showSwitch.text">
        <el-form-item label="字体类型">
          <el-select v-model="legend.textStyle.fontFamily" placeholder="请选择">
            <el-option
              v-for="(item, index) in styleSelection.title.fontFamily.selection"
              :key="index"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="字体大小">
          <el-select v-model="legend.textStyle.fontSize">
            <el-option
              v-for="(sel, idx) in styleSelection.legend.fontSize.selection"
              :key="idx"
              :label="sel.text"
              :value="sel.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="字体颜色">
          <el-row>
            <el-col :span="18">
              <el-select v-model="legend.textStyle.color">
                <el-option
                  v-for="(item, index) in styleSelection.title.color.selection"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-col>

            <el-col :span="5" :offset="1" style="height: 32px;">
              <color-picker v-model="legend.textStyle.color" />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="阴影颜色">
          <el-row>
            <el-col :span="18">
              <el-select v-model="legend.textStyle.textShadowColor">
                <el-option
                  v-for="(item, index) in styleSelection.title.color.selection"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-col>

            <el-col :span="5" :offset="1" style="height: 32px;">
              <color-picker v-model="legend.textStyle.textShadowColor" />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="阴影大小">
          <el-slider v-model="legend.textStyle.textShadowBlur" :min="0" />
        </el-form-item>

        <el-form-item label="水平偏移">
          <el-slider v-model="legend.textStyle.textShadowOffsetX" :min="-100" />
        </el-form-item>

        <el-form-item label="垂直偏移">
          <el-slider v-model="legend.textStyle.textShadowOffsetY" :min="-100" />
        </el-form-item>
      </detail-card>

      <!-- 内边距 -->
      <el-form-item label="内边距">
        <switch-button v-model="showSwitch.padding"></switch-button>
      </el-form-item>
      <detail-card :visible="showSwitch.padding">
        <el-form-item label="上边距">
          <el-slider v-model="legend.padding[0]" :min="0" />
        </el-form-item>

        <el-form-item label="右边距">
          <el-slider v-model="legend.padding[1]" :min="0" />
        </el-form-item>

        <el-form-item label="下边距">
          <el-slider v-model="legend.padding[2]" :min="0" />
        </el-form-item>

        <el-form-item label="左边距">
          <el-slider v-model="legend.padding[3]" :min="0" />
        </el-form-item>
      </detail-card>

      <!-- 边框 -->
      <el-form-item label="边框">
        <switch-button v-model="showSwitch.border"></switch-button>
      </el-form-item>
      <detail-card :visible="showSwitch.border">
        <el-form-item label="边框颜色">
          <el-row>
            <el-col :span="18">
              <el-select v-model="legend.borderColor">
                <el-option
                  v-for="(item, index) in styleSelection.title.color.selection"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-col>

            <el-col :span="5" :offset="1" style="height: 32px;">
              <color-picker v-model="legend.borderColor" />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="边框宽度">
          <el-slider v-model="legend.borderWidth" :min="0" />
        </el-form-item>

        <el-form-item label="边框圆角">
          <el-slider v-model="legend.borderRadius" :min="0" />
        </el-form-item>
      </detail-card>

      <!-- 阴影 -->
      <el-form-item label="阴影">
        <switch-button v-model="showSwitch.shadow"></switch-button>
      </el-form-item>
      <detail-card :visible="showSwitch.shadow">
        <el-form-item label="阴影颜色">
          <el-row>
            <el-col :span="18">
              <el-select v-model="legend.shadowColor">
                <el-option
                  v-for="(item, index) in styleSelection.title.color.selection"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-col>

            <el-col :span="5" :offset="1" style="height: 32px;">
              <color-picker v-model="legend.shadowColor" />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="阴影大小">
          <el-slider v-model="legend.shadowBlur" :min="0" />
        </el-form-item>

        <el-form-item label="水平偏移">
          <el-slider v-model="legend.shadowOffsetX" :min="-100" />
        </el-form-item>

        <el-form-item label="垂直偏移">
          <el-slider v-model="legend.shadowOffsetY" :min="-100" />
        </el-form-item>
      </detail-card>

      <!-- 位移 -->
      <el-form-item label="位移">
        <switch-button v-model="showSwitch.position"></switch-button>
      </el-form-item>
      <detail-card :visible="showSwitch.position">
        <el-form-item label="水平位移">
          <el-input placeholder="X轴" v-model="legend.right"></el-input>
        </el-form-item>

        <el-form-item label="垂直位移">
          <el-input placeholder="Y轴" v-model="legend.top"></el-input>
        </el-form-item>
      </detail-card>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import DetailCard from "@/components/DetailCard.vue";
import ColorPicker from "@/components/color-picker/index.vue";
import SwitchButton from "@/components/SwitchButton.vue";
import { SeriesOption } from "glaway-bi-model/view/dashboard/chart/SeriesOption";

@Component({
  components: {
    DetailCard,
    ColorPicker,
    SwitchButton
  }
})
export default class LegendStyle extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @EditorStore.State("styleSelection")
  styleSelection!: Object;

  @Inject()
  boxCardBodyStyle!: Properties;

  @Inject()
  elFormLabelWidth!: string;

  @Inject()
  boxCardShadow!: string;

  get legend() {
    return this.currentDashboard.echarts.legend;
  }

  showSwitch = {
    legend: true,
    position: true,
    border: true,
    text: true,
    shadow: true,
    padding: true,
    textInput: true
  };
}
</script>

<style lang="scss" scoped></style>
