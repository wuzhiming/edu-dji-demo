import './assets/tailwind.css';
import 'bulma/css/bulma.css';

import { h, createApp } from 'vue';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LeftOutlined,
  StepBackwardOutlined,
  CaretLeftOutlined,
  StepForwardOutlined,
  CaretRightOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons-vue';

import App from './App.vue';

const app = createApp(App);

[
  //
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LeftOutlined,
  StepBackwardOutlined,
  CaretLeftOutlined,
  StepForwardOutlined,
  CaretRightOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
].forEach((comp) => app.component(comp.name, comp));

app.mount('#app');
