import ChartHandler from "../interfaces/ChartHandler";
import BarHandler from "./BarHandler";
import BarStackHandler from "./BarStackHandler";
import BarPercentageHandler from "./BarPercentageHandler";
import HBarHandler from "./HBarHandler";
import PieHandler from "./PieHandler";
import LineHandler from "./LineHandler";

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
