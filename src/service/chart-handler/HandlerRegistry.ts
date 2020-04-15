import BarHandler from "./BarHandler";
import PieHandler from "./PieHandler";
import LineHandler from "./LineHandler";

const HANDLER_REGISTRY: { [key: string]: Function } = {
  bar: BarHandler,

  pie: PieHandler,

  line: LineHandler
};

export default HANDLER_REGISTRY;
