import BarHandler from "./BarHandler";
import PieHandler from "./PieHandler";
import LineHandler from "./LineHandler";
import BarStackHandler from "./BarStackHandler"
import ChartHandler from "../interfaces/ChartHandler";

const HANDLER_REGISTRY: { [key: string]: ChartHandler } = {
  bar: BarHandler,

  pie: PieHandler,

  line: LineHandler,

  barStack: BarStackHandler
};

export default HANDLER_REGISTRY;
