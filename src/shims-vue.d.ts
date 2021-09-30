// vue3
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '*.scss' {
  const styles: Record<string, any>;
  export default styles;
}

declare module '*.less' {
  const styles: Record<string, any>;
  export default styles;
}
