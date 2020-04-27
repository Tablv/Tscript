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
import SunPieHandler from "./chart-handler/SunPieHandler";
import LineHandler from "./chart-handler/LineHandler";
import GuageHandler from "./chart-handler/GuageHandler";
import TargetPieHandler from "./chart-handler/TargetPieHandler";

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
  sunpie: new SunPieHandler(),
  targetpie: new TargetPieHandler(),

  /**
   * 折线图
   */
  line: new LineHandler(),

  /**
   * 折线图
   */
  guage: new GuageHandler()
};

export default HANDLER_REGISTRY;
