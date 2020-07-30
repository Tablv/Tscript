declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
declare module "vuedraggable";
declare module "vue-draggable-resizable-gorkys";
declare module "element-ui/src/utils/clickoutside";

declare namespace JSX {
  interface IntrinsicElements {
    [key: string]: any;
  }
}
