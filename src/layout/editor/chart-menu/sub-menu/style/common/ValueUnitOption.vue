<template>
  <el-form-item :label="formLabel">
    <el-row>
      <el-col :span="13">
        <el-input-number
          v-model="valueVal"
          controls-position="right"
          :min="0"
        />
      </el-col>

      <el-col :span="10" :offset="1">
        <el-select v-model="unitVal" size="small" placeholder="单位">
          <el-option
            v-for="unit in selection"
            :key="unit.text"
            :label="unit.text"
            :value="unit.value"
          />
        </el-select>
      </el-col>
    </el-row>
  </el-form-item>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Model } from "vue-property-decorator";

@Component
export default class ValueUnitOption extends Vue {
  @Prop()
  formLabel!: string;

  @Prop()
  selection!: Array<SelectionEntity>;

  @Model("valueUnit")
  valueUnit!: ValueUnitEntity;

  isValIniting = true;
  isUnitIniting = true;
  settimeId = 0;

  get valueVal() {
    return this.valueUnit.value;
  }

  set valueVal(value) {
    if (value === this.valueVal) return;
    this.updateEmit(value, this.unitVal);
  }

  get unitVal() {
    return this.valueUnit.unit;
  }

  set unitVal(unit) {
    this.updateEmit(this.valueVal, unit);
  }

  updateEmit(value: number, unit: string): void {
    this.$emit("valueUnit", {
      value,
      unit
    });
    this.$emit("change", {
      value,
      unit
    });
  }
}

interface SelectionEntity {
  /**
   * 文本
   */
  text: string;

  /**
   * 值
   */
  value: string;
}

interface ValueUnitEntity {
  /**
   * 值
   */
  value: number;

  /**
   * 单位
   */
  unit: string;
}
</script>

<style lang="scss" scoped>
.el-input-number--small {
  width: 100px;
}
</style>
