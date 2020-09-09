<template>
  <!-- 标注 -->
  <el-card
    class="box-card"
    :body-style="boxCardBodyStyle"
    :shadow="boxCardShadow"
    v-if="specificStyle.label"
  >
    <template #header>
      <span>数据标注</span>
    </template>

    <el-form label-position="right" :label-width="elFormLabelWidth">
      <el-form-item label="显示数据标注">
        <el-switch active-color="#13ce66" v-model="specificStyle.label.show" />
      </el-form-item>

      <el-form-item
        label="显示数值"
        v-if="typeof specificStyle.isShowNumber !== 'undefind'"
      >
        <el-switch
          active-color="#13ce66"
          v-model="specificStyle.label.isShowNumber"
        />
      </el-form-item>

      <el-form-item label="背景色">
        <el-row>
          <el-col :span="18">
            <el-select v-model="specificStyle.label.backgroundColor">
              <el-option
                v-for="(item, index) in styleSelection.label.color.selection"
                :key="index"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-col>

          <el-col :span="5" :offset="1" style="height: 32px;">
            <color-picker v-model="specificStyle.label.backgroundColor" />
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="位置" v-if="specificStyle.label.position">
        <el-row>
          <el-col :span="22">
            <el-select
              v-model="specificStyle.label.position"
              size="mini"
              placeholder="位置"
            >
              <el-option
                v-for="(unit, index) in styleSelection.label.position.selection"
                :key="index"
                :label="unit.text"
                :value="unit.value"
              />
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item
        label="旋转角度"
        v-if="specificStyle.label.rotate !== undefind"
      >
        <el-row>
          <el-col :span="22">
            <el-slider
              v-model="specificStyle.label.rotate"
              :max="90"
              :min="-90"
            />
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item
        label="水平偏移量"
        v-if="specificStyle.label.offset && !specificStyle.label.position"
      >
        <el-slider
          v-model="specificStyle.label.offset[0]"
          :max="100"
          :min="-100"
        />
      </el-form-item>

      <el-form-item
        label="垂直偏移量"
        v-if="specificStyle.label.offset && !specificStyle.label.position"
      >
        <el-slider
          v-model="specificStyle.label.offset[1]"
          :max="100"
          :min="-100"
        />
      </el-form-item>

      <!-- 文本 -->
      <el-form-item label="文本">
        <switch-button v-model="showSwitch.text"></switch-button>
      </el-form-item>
      <detail-card :visible="showSwitch.text">
        <el-form-item label="字体">
          <el-select
            v-model="specificStyle.label.fontFamily"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in styleSelection.label.fontFamily.selection"
              :key="index"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="字体大小">
          <el-select
            v-model="specificStyle.label.fontSize"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in styleSelection.label.size.selection"
              :key="index"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="字体颜色">
          <el-row>
            <el-col :span="18">
              <el-select v-model="specificStyle.label.color">
                <el-option
                  v-for="(item, index) in styleSelection.label.color.selection"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-col>

            <el-col :span="5" :offset="1" style="height: 32px;">
              <color-picker v-model="specificStyle.label.color" />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="阴影颜色">
          <el-row>
            <el-col :span="18">
              <el-select v-model="specificStyle.label.textShadowColor">
                <el-option
                  v-for="(item, index) in styleSelection.title.color.selection"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-col>

            <el-col :span="5" :offset="1" style="height: 32px;">
              <color-picker v-model="specificStyle.label.textShadowColor" />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="阴影大小">
          <el-slider v-model="specificStyle.label.textShadowBlur" :min="0" />
        </el-form-item>

        <el-form-item label="水平偏移">
          <el-slider
            v-model="specificStyle.label.textShadowOffsetX"
            :min="-100"
          />
        </el-form-item>

        <el-form-item label="垂直偏移">
          <el-slider
            v-model="specificStyle.label.textShadowOffsetY"
            :min="-100"
          />
        </el-form-item>
      </detail-card>

      <!-- 边距 -->
      <el-form-item label="内边距">
        <switch-button v-model="showSwitch.padding"></switch-button>
      </el-form-item>
      <detail-card :visible="showSwitch.padding">
        <el-form-item label="上边距">
          <el-slider v-model="specificStyle.label.padding[0]" :min="0" />
        </el-form-item>

        <el-form-item label="右边距">
          <el-slider v-model="specificStyle.label.padding[1]" :min="0" />
        </el-form-item>

        <el-form-item label="下边距">
          <el-slider v-model="specificStyle.label.padding[2]" :min="0" />
        </el-form-item>

        <el-form-item label="左边距">
          <el-slider v-model="specificStyle.label.padding[3]" :min="0" />
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
              <el-select v-model="specificStyle.label.borderColor">
                <el-option
                  v-for="(item, index) in styleSelection.label.color.selection"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-col>

            <el-col :span="5" :offset="1" style="height: 32px;">
              <color-picker v-model="specificStyle.label.borderColor" />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="边框宽度">
          <el-slider v-model="specificStyle.label.borderWidth" :min="0" />
        </el-form-item>

        <el-form-item label="边框圆角">
          <el-slider v-model="specificStyle.label.borderRadius" :min="0" />
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
              <el-select v-model="specificStyle.label.shadowColor">
                <el-option
                  v-for="(item, index) in styleSelection.title.color.selection"
                  :key="index"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-col>

            <el-col :span="5" :offset="1" style="height: 32px;">
              <color-picker v-model="specificStyle.label.shadowColor" />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="阴影大小">
          <el-slider v-model="specificStyle.label.shadowBlur" :min="0" />
        </el-form-item>

        <el-form-item label="水平偏移">
          <el-slider v-model="specificStyle.label.shadowOffsetX" :min="-100" />
        </el-form-item>

        <el-form-item label="垂直偏移">
          <el-slider v-model="specificStyle.label.shadowOffsetY" :min="-100" />
        </el-form-item>
      </detail-card>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject } from "vue-property-decorator";
import { CommonStore, EditorStore } from "@/store/modules-model";
import { Properties } from "csstype";
import Dashboard from "glaway-bi-model/view/dashboard/Dashboard";
import { SeriesOption } from "glaway-bi-model/view/dashboard/chart/SeriesOption";
import { EChartsSampleStyle } from "glaway-bi-model/view/dashboard/chart/EChartsOption";
import DetailCard from "@/components/DetailCard.vue";
import ColorPicker from "@/components/color-picker/index.vue";
import SwitchButton from "@/components/SwitchButton.vue";

@Component({
  components: {
    DetailCard,
    SwitchButton,
    ColorPicker
  }
})
export default class LabelStyle extends Vue {
  @CommonStore.Getter("currentDashboard")
  currentDashboard!: Dashboard;

  @EditorStore.State("styleSelection")
  styleSelection!: Object;

  @Inject()
  getSpecificStyle!: Function;

  get specificStyle(): SeriesOption {
    return this.getSpecificStyle();
  }

  @Inject()
  boxCardBodyStyle!: Properties;

  @Inject()
  elFormLabelWidth!: string;

  @Inject()
  boxCardShadow!: string;

  showSwitch = {
    text: true,
    padding: true,
    border: true,
    shadow: true
  };
}
</script>

<style lang="scss" scoped></style>
