import { ChartType } from "@/enums/ChartType";
import { EChartsSampleStyle } from "@/model/view/dashboard/EChartsOption";

/**
 * 可视化数据
 */
export default interface VisualData {
  // 图表类型
  type: ChartType;

  // 网格尺寸
  grid: Array<number>;

  // 图表位置
  position: VisualLocation;

  // 宽度
  width: number;

  // 高度
  height: number;

  // 各图表样例样式
  // (适用于各图表Handler取值，生成带有样式的数据用)
  sampleStyle: EChartsSampleStyle;
}

/**
 * 可视化坐标定位
 */
interface VisualLocation {
  x: number;
  y: number;
  z: number;
}