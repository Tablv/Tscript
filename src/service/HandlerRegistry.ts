import ChartHandler from "./interfaces/ChartHandler";
import BarHandler from "./chart-handler/BarHandler";
import BarStackHandler from "./chart-handler/BarStackHandler";
import BarPercentageHandler from "./chart-handler/BarPercentageHandler";
import HBarHandler from "./chart-handler/HBarHandler";
import PieHandler from "./chart-handler/PieHandler";
import LineHandler from "./chart-handler/LineHandler";

const HANDLER_REGISTRY: { [key: string]: ChartHandler } = {
  /**
   * 柱图
   */
  bar: new BarHandler(),
  barStack: new BarStackHandler(),
  barPercentage: new BarPercentageHandler(),

  hbar: new HBarHandler(),

  /**
   * 饼图
   */
  pie: new PieHandler(),

  /**
   * 折线图
   */
  line: new LineHandler()
};

export default HANDLER_REGISTRY;
