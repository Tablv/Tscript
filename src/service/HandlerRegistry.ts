import ChartHandler from "./interfaces/ChartHandler";
import BarHandler from "./chart-handler/BarHandler";
import BarStackHandler from "./chart-handler/BarStackHandler";
import BarPercentageHandler from "./chart-handler/BarPercentageHandler";
import HBarHandler from "./chart-handler/HBarHandler";
import HBarStackHandler from "./chart-handler/HBarStackHandler";
import HBarPercentageHandler from "./chart-handler/HBarPercentageHandler";
import PieHandler from "./chart-handler/PieHandler";
import RPieHandler from "./chart-handler/RPieHandler";
import RosePieHandler from "./chart-handler/RosePieHandler";
import LineHandler from "./chart-handler/LineHandler";

const HANDLER_REGISTRY: { [key: string]: ChartHandler } = {
  /**
   * 柱图
   */
  bar: new BarHandler(),
  barStack: new BarStackHandler(),
  barPercentage: new BarPercentageHandler(),

  hbar: new HBarHandler(),
  hbarStack: new HBarStackHandler(),
  hbarPercentage: new HBarPercentageHandler(),

  /**
   * 饼图
   */
  pie: new PieHandler(),
  rpie: new RPieHandler(),
  rosepie: new RosePieHandler(),

  /**
   * 折线图
   */
  line: new LineHandler()
};

export default HANDLER_REGISTRY;
