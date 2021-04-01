declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@ckeditor/ckeditor5-vue';
declare module '@ckeditor/ckeditor5-build-decoupled-document';
declare module "vue-terminal" {
  import VueTerminal from 'vue-terminal';
  export default VueTerminal;
};
declare module '*.json' {
  const value: any;
  export default value;
}